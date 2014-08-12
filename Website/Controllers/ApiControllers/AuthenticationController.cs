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
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
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
        private readonly IAccountService accountService;
        
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

        public AuthenticationController(IUnityContainer container, CreateAccountSessionHelper coaSessionHelper, ResetPasswordSessionHelper resetPasswordSessionHelper, ResetPasswordTokenManager resetPasswordTokenManager, IEmailService emailService, ISettings settings, IAccountService accountService)
        {
            this.container = container;
            this.coaSessionHelper = coaSessionHelper;
            this.resetPasswordSessionHelper = resetPasswordSessionHelper;
            this.resetPasswordTokenManager = resetPasswordTokenManager;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
            this.emailService = emailService;
            this.accountService = accountService;
            this.settings = settings;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            Initialize().Wait();
            base.Initialize(controllerContext);
        }

        public async Task Initialize()
        {
            await Task.WhenAll(
                coaSessionHelper.EnsureInitialized(),
                resetPasswordSessionHelper.EnsureInitialized());
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
                // validate the return URI
                Uri requestUri = new Uri(request.Uri);
                string returnUri = HttpUtility.ParseQueryString(requestUri.Query).Get("item");

                var helper = new System.Web.Mvc.UrlHelper(System.Web.HttpContext.Current.Request.RequestContext);
                bool isLocal = helper.IsLocalUrl(returnUri);

                if (string.IsNullOrEmpty(returnUri) || !isLocal)
                {
                    returnUri = "/account";
                }
   
                var response = Request.CreateResponse(new LoginResponse()
                {
                    Success = true,
                    ReturnURI = returnUri
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
        public async Task<FindAccountResponse> FindAccount(FindAccountRequest request)
        {
            if (coaSessionHelper.StateMachine.State != typeof(FindAccountState))
            {
                coaSessionHelper.Reset();
                await coaSessionHelper.EnsureInitialized();
            }

            coaSessionHelper.StateMachine.Context.AccountNumber = request.AccountNumber;
            coaSessionHelper.StateMachine.Context.SsnLastFour = request.SsnLastFour;

            if (coaSessionHelper.StateMachine.State == typeof(FindAccountState))
                await coaSessionHelper.StateMachine.Process(typeof(AccountInformationState));

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
        public async Task<HttpResponseMessage> CreateLogin(CreateLoginRequest request)
        {
            coaSessionHelper.StateMachine.Context.Username = domain.AccountPrefix + request.Username;
            coaSessionHelper.StateMachine.Context.Password = request.Password;
            coaSessionHelper.StateMachine.Context.ConfirmPassword = request.ConfirmPassword;
            coaSessionHelper.StateMachine.Context.Challenges = request.Challenges.ToDictionary(c => c.SelectedQuestion.Id, c => c.Answer);

            if (coaSessionHelper.StateMachine.State == typeof(AccountInformationState) || coaSessionHelper.StateMachine.State == typeof(CreateAccountState))
                await coaSessionHelper.StateMachine.Process();

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
        public async Task<GetUserChallengeQuestionsResponse> GetUserChallengeQuestions(GetUserChallengeQuestionsRequest request)
        {
            resetPasswordSessionHelper.Reset();
            await resetPasswordSessionHelper.EnsureInitialized();

            resetPasswordSessionHelper.Context.DomainPrefix = domain.AccountPrefix;
            resetPasswordSessionHelper.Context.Username = request.Username;

            await resetPasswordSessionHelper.StateMachine.Process(typeof(VerifyUserState));
            var profile = UserProfile.Locate(container, resetPasswordSessionHelper.Context.DomainPrefix + resetPasswordSessionHelper.Context.Username);

            
            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (resetPasswordSessionHelper.StateMachine.State == typeof(GetUsernameState))
                validations = resetPasswordSessionHelper.StateMachine.ValidationResults;

            var email = await accountService.GetEmailByCustomerId(profile.GlobalCustomerId);

            return new GetUserChallengeQuestionsResponse
            {
                Username = request.Username,
                Email = email == null ? null : Redact(email),
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

        private string Redact(string email)
        {
            return System.Text.RegularExpressions.Regex.Replace(email ?? "", "^(..?)[^@]*@(.*)$", "$1******@$2");
        }

        [HttpPost]
        public VerifyUserChallengeQuestionsResponse VerifyUserChallengeQuestions(VerifyUserChallengeQuestionsRequest request)
        {
            Sitecore.Context.Database = database;
            resetPasswordSessionHelper.Context.Answers = request.Answers.ToDictionary(a => a.Key, a => a.Value);
            resetPasswordSessionHelper.Context.SendEmail = false;

            if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifyUserState))
                resetPasswordSessionHelper.StateMachine.Process();

            var validations = Enumerable.Empty<ValidationResult>();
            // don't give validations for the next step
            if (coaSessionHelper.StateMachine.State == typeof(VerifyUserState))
                validations = coaSessionHelper.StateMachine.ValidationResults;

            return new VerifyUserChallengeQuestionsResponse
            {
                // TODO - pull from Stream Connect
                AccountName = "Account Name",
                Success = resetPasswordSessionHelper.StateMachine.State == typeof(VerifiedChallengeQuestionsState),
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Forgot Password"))
            };
        }

        [HttpPost]
        public SendResetPasswordEmailResponse SendResetPasswordEmail(SendResetPasswordEmailRequest request)
        {
            Sitecore.Context.Database = database;
            resetPasswordSessionHelper.Context.SendEmail = true;

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
                bool isValid = false;
                string username;

                if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifiedChallengeQuestionsState))
                {
                    username = resetPasswordSessionHelper.Context.Username;
                    isValid = true;
                    resetPasswordSessionHelper.Reset();
                }
                else if (resetPasswordTokenManager.VerifyAndClearPasswordResetToken(request.ResetToken, out username))
                {
                    isValid = true;
                }

                if (isValid)
                {
                    var user = Membership.GetUser(domain.AccountPrefix + username);
                    user.UnlockUser();
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

        #region Change Username

        public bool ChangeUsername(string oldUsername, string newUsername)
        {
            string ConnectionString = Sitecore.Configuration.Settings.GetConnectionString("core");

            using (SqlConnection connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = "UPDATE aspnet_Users SET UserName=@NewUsername,LoweredUserName=@LoweredNewUsername WHERE UserName=@OldUsername";

                    SqlParameter parameter = new SqlParameter("@OldUsername", SqlDbType.VarChar);
                    parameter.Value = oldUsername;
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@NewUsername", SqlDbType.VarChar);
                    parameter.Value = newUsername;
                    command.Parameters.Add(parameter);

                    parameter = new SqlParameter("@LoweredNewUsername", SqlDbType.VarChar);
                    parameter.Value = newUsername.ToLower();
                    command.Parameters.Add(parameter);

                    return command.ExecuteNonQuery() > 0;
                }
            }
        }

        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

        public void AddAuthenticationCookie(HttpResponseMessage response, string username)
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
