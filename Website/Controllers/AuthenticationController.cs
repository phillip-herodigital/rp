using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Accounts.Create;
using StreamEnergy.DomainModels.Accounts.ResetPassword;
using StreamEnergy.DomainModels.Emails;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.Processes;
using StreamEnergy.Services.Clients;

namespace StreamEnergy.MyStream.Controllers
{
    public class AuthenticationController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly CreateAccountSessionHelper coaSessionHelper;
        private readonly ResetPasswordSessionHelper resetPasswordSessionHelper;
        private readonly ResetPasswordTokenManager resetPasswordTokenManager;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly IEmailService emailService;
        private readonly ISettings settings;
        
        #region Session Helper Classes
        public class CreateAccountSessionHelper : StateMachineSessionHelper<CreateAccountContext, CreateAccountInternalContext>
        {
            public CreateAccountSessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(AuthenticationController), typeof(FindAccountState), storeInternal: false)
            {
            }
        }

        public class ResetPasswordSessionHelper : StateMachineSessionHelper<ResetPasswordContext, object>
        {
            public ResetPasswordSessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(AuthenticationController), typeof(GetUsernameState), storeInternal: false)
            {
            }
        }
        #endregion

        public AuthenticationController(IUnityContainer container, CreateAccountSessionHelper coaSessionHelper, ResetPasswordSessionHelper resetPasswordSessionHelper, ResetPasswordTokenManager resetPasswordTokenManager, IEmailService emailService, ISettings settings)
        {
            this.container = container;
            this.coaSessionHelper = coaSessionHelper;
            this.resetPasswordSessionHelper = resetPasswordSessionHelper;
            this.resetPasswordTokenManager = resetPasswordTokenManager;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
            this.emailService = emailService;
            this.settings = settings;
        }

        protected override void Dispose(bool disposing)
        {
            coaSessionHelper.Dispose();
            resetPasswordSessionHelper.Dispose();

            base.Dispose(disposing);
        }

        #region Login

        [HttpPost]
        public HttpResponseMessage Login(LoginRequest request)
        {
            request.Domain = domain;
            ModelState.Clear();
            Validate(request, "request");
            if (ModelState.IsValid)
            {
                var response = Request.CreateResponse(new LoginResponse()
                {
                    Success = true
                });

                AddAuthenticationCookie(response, request.Username);
                return response;
            }

            return Request.CreateResponse(new LoginResponse
                    {
                        Success = false,
                        Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("My Stream Account"))
                    });
        }

        #endregion

        #region Create Online Account

        [HttpPost]
        public FindAccountResponse FindAccount(FindAccountRequest request)
        {
            if (coaSessionHelper.StateMachine.State != typeof(FindAccountState))
            {
                coaSessionHelper.Reset();
            }

            coaSessionHelper.StateMachine.Context.AccountNumber = request.AccountNumber;
            coaSessionHelper.StateMachine.Context.SsnLastFour = request.SsnLastFour;

            if (coaSessionHelper.StateMachine.State == typeof(FindAccountState))
                coaSessionHelper.StateMachine.Process(typeof(AccountInformationState));

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(FindAccountState))
                validations = coaSessionHelper.StateMachine.ValidationResults;
                
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");
            return new FindAccountResponse
            {
                AccountNumber = coaSessionHelper.StateMachine.Context.AccountNumber,
                SsnLastFour = coaSessionHelper.StateMachine.Context.SsnLastFour,
                Customer = coaSessionHelper.StateMachine.Context.Customer,
                Address = coaSessionHelper.StateMachine.Context.Address,
                AvailableSecurityQuestions =
                    from questionItem in (questionsRoot != null ? questionsRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                    select new SecurityQuestion
                    {
                        Id = questionItem.ID.Guid,
                        Text = questionItem["Question"]
                    },
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Create Account - Step 1"))
            };
        }

        [HttpPost]
        public HttpResponseMessage CreateLogin(CreateLoginRequest request)
        {
            coaSessionHelper.StateMachine.Context.Username = domain.AccountPrefix + request.Username;
            coaSessionHelper.StateMachine.Context.Password = request.Password;
            coaSessionHelper.StateMachine.Context.ConfirmPassword = request.ConfirmPassword;
            coaSessionHelper.StateMachine.Context.Challenges = request.Challenges.ToDictionary(c => c.SelectedQuestion.Id, c => c.Answer);

            if (coaSessionHelper.StateMachine.State == typeof(AccountInformationState) || coaSessionHelper.StateMachine.State == typeof(CreateAccountState))
                coaSessionHelper.StateMachine.Process();

            var success = coaSessionHelper.StateMachine.State == typeof(CompleteState);

            var response = Request.CreateResponse(new CreateLoginResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(coaSessionHelper.StateMachine.ValidationResults, GetAuthItem("Create Account - Step 2"))
            });

            if (success)
            {
                AddAuthenticationCookie(response, request.Username);
            }

            return response;
        }

        #endregion

        #region Reset Password

        [HttpPost]
        public GetUserChallengeQuestionsResponse GetUserChallengeQuestions(GetUserChallengeQuestionsRequest request)
        {
            resetPasswordSessionHelper.Reset();

            resetPasswordSessionHelper.Context.DomainPrefix = domain.AccountPrefix;
            resetPasswordSessionHelper.Context.Username = request.Username;

            resetPasswordSessionHelper.StateMachine.Process(typeof(VerifyUserState));

            
            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(GetUsernameState))
                validations = coaSessionHelper.StateMachine.ValidationResults;
                
            return new GetUserChallengeQuestionsResponse
            {
                Username = request.Username,
                SecurityQuestions = from challenge in resetPasswordSessionHelper.Context.Answers ?? new Dictionary<Guid, string>()
                                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                                    select new SecurityQuestion
                                    {
                                        Id = challenge.Key,
                                        Text = questionItem != null ? questionItem["Question"] : ""
                                    },
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        [HttpPost]
        public SendResetPasswordEmailResponse SendResetPasswordEmail(SendResetPasswordEmailRequest request)
        {
            Sitecore.Context.Database = database;
            resetPasswordSessionHelper.Context.Answers = request.Answers.ToDictionary(a => a.Key, a => a.Value);

            if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifyUserState))
                resetPasswordSessionHelper.StateMachine.Process();

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(VerifyUserState))
                validations = coaSessionHelper.StateMachine.ValidationResults;
                
            return new SendResetPasswordEmailResponse
            {
                Success = resetPasswordSessionHelper.StateMachine.State == typeof(SentEmailState),
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        [HttpPost]
        public ChangePasswordResponse ChangePassword(ChangePasswordRequest request)
        {
            bool success = false;
            if (ModelState.IsValid)
            {
                string username;
                if (resetPasswordTokenManager.VerifyAndClearPasswordResetToken(request.ResetToken, out username))
                {
                    var user = Membership.GetUser(domain.AccountPrefix + username);
                    user.ChangePassword(user.ResetPassword(), request.Password);
                    success = true;
                }
            }
            return new ChangePasswordResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Change Password"))
            };
        }

        #endregion

        #region Recover Username

        [HttpPost]
        public RecoverUsernameResponse RecoverUsername(RecoverUsernameRequest request)
        {
            Sitecore.Context.Database = database;
            var success = false;
            if (ModelState.IsValid)
            {
                // TODO - call out to Stream Connect to get a list of usernames
                IEnumerable<string> usernames = new[] { "mdekrey", "mdekrey2", "mdekrey3" };

                var toEmail = request.Email.Address;

                // Send the email
                emailService.SendEmail(new MailMessage()
                {
                    From = new MailAddress(settings.GetSettingsValue("Authorization Email Addresses", "Send From Email Address")),
                    To = { toEmail },
                    // TODO get subject and body template from Sitecore
                    Subject = "Stream Energy Username Recovery",
                    IsBodyHtml = true,
                    Body = "The follwing usernames are associated with this account: " + string.Join(", ", usernames)
                });

                success = true;
            }
            return new RecoverUsernameResponse
            {
                Email = request.Email,
                Success = success,
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Forgot Username"))
            };
        }
        
        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

        private void AddAuthenticationCookie(HttpResponseMessage response, string username)
        {
            var cookie = FormsAuthentication.GetAuthCookie(domain.AccountPrefix + username, false, "/");
            response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value) 
                    { 
                        Domain = cookie.Domain, 
                        Expires = cookie.Expires == DateTime.MinValue ? null : (DateTime?)cookie.Expires, 
                        HttpOnly = cookie.HttpOnly, 
                        Path = cookie.Path, 
                        Secure = cookie.Secure 
                    }
                });
        }

    }
}
