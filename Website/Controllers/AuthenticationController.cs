using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Accounts.Create;
using StreamEnergy.DomainModels.Accounts.ResetPassword;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.Processes;

namespace StreamEnergy.MyStream.Controllers
{
    public class AuthenticationController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly CreateAccountSessionHelper coaSessionHelper;
        private readonly ResetPasswordSessionHelper resetPasswordSessionHelper;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;

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

        public AuthenticationController(IUnityContainer container, CreateAccountSessionHelper coaSessionHelper, ResetPasswordSessionHelper resetPasswordSessionHelper)
        {
            this.container = container;
            this.coaSessionHelper = coaSessionHelper;
            this.resetPasswordSessionHelper = resetPasswordSessionHelper;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
        }

        protected override void Dispose(bool disposing)
        {
            coaSessionHelper.Dispose();
            resetPasswordSessionHelper.Dispose();

            base.Dispose(disposing);
        }

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
                
            return new FindAccountResponse
            {
                AccountNumber = coaSessionHelper.StateMachine.Context.AccountNumber,
                SsnLastFour = coaSessionHelper.StateMachine.Context.SsnLastFour,
                Customer = coaSessionHelper.StateMachine.Context.Customer,
                Address = coaSessionHelper.StateMachine.Context.Address,
                AvailableSecurityQuestions = Dummy<IEnumerable<Models.Authentication.SecurityQuestion>>(),
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
                Validations = TranslatedValidationResult.Translate(ModelState, GetAuthItem("Create Account - Step 2"))
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

            resetPasswordSessionHelper.Context.Username = domain.AccountPrefix + request.Username;

            resetPasswordSessionHelper.StateMachine.Process(typeof(VerifyUserState));

            return new GetUserChallengeQuestionsResponse
            {
                Username = request.Username,
                SecurityQuestions = from challenge in resetPasswordSessionHelper.Context.ChallengeQuestions ?? new Dictionary<Guid, string>()
                                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                                    select new SecurityQuestion
                                    {
                                        Id = challenge.Key,
                                        Text = questionItem["Question"]
                                    },
                Validations = TranslatedValidationResult.Translate(resetPasswordSessionHelper.StateMachine.ValidationResults, item)
            };
        }

        [HttpPost]
        public SendResetPasswordEmailResponse SendResetPasswordEmail(SendResetPasswordEmailRequest request)
        {
            resetPasswordSessionHelper.Context.ChallengeQuestions = request.Answers.ToDictionary(a => a.SelectedQuestion.Id, a => a.Answer);

            if (resetPasswordSessionHelper.StateMachine.State == typeof(VerifyUserState))
                resetPasswordSessionHelper.StateMachine.Process();

            return new SendResetPasswordEmailResponse
            {
                Success = resetPasswordSessionHelper.StateMachine.State == typeof(SentEmailState),
                Validations = TranslatedValidationResult.Translate(resetPasswordSessionHelper.StateMachine.ValidationResults, item)
            };
        }

        [HttpPost]
        public ChangePasswordResponse ChangePassword(ChangePasswordRequest request)
        {
            return Dummy<ChangePasswordResponse>();
        }

        #endregion

        #region Recover Username

        [HttpPost]
        public RecoverUsernameResponse RecoverUsername(RecoverUsernameRequest request)
        {
            return Dummy<RecoverUsernameResponse>();
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

        private T Dummy<T>()
        {
            return (T)Dummy(typeof(T));
        }

        private object Dummy(Type type)
        {
            if (type == typeof(string))
                return "string";
            if (type == typeof(bool))
                return true;

            if (type.IsGenericType && type.GetGenericTypeDefinition() == typeof(IEnumerable<>))
            {
                var args = type.GetGenericArguments();
                var list = (System.Collections.IList)Activator.CreateInstance(typeof(List<>).MakeGenericType(args));
                var copy = Dummy(args[0]);
                list.Add(copy);
                list.Add(copy);
                list.Add(copy);
                return list;
            }

            var result = Activator.CreateInstance(type);
            foreach (var property in type.GetProperties())
            {
                property.SetValue(result, Dummy(property.PropertyType));
            }
            return result;
        }
    }
}
