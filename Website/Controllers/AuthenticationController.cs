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
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.Processes;

namespace StreamEnergy.MyStream.Controllers
{
    public class AuthenticationController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly List<Action> onDispose = new List<Action>();
        private CreateAccountSessionHelper coaSessionHelper;

        public class CreateAccountSessionHelper : StateMachineSessionHelper<CreateAccountContext, CreateAccountInternalContext>
        {
            public CreateAccountSessionHelper(HttpSessionStateBase session, StateMachine<CreateAccountContext, CreateAccountInternalContext> stateMachine, IUnityContainer container)
                : base(session, stateMachine, container, typeof(AuthenticationController), typeof(FindAccountState))
            {
            }
        }

        public AuthenticationController(IUnityContainer container, CreateAccountSessionHelper coaSessionHelper)
        {
            this.container = container;
            this.coaSessionHelper = coaSessionHelper;

            item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Authentication");
        }

        protected override void Dispose(bool disposing)
        {
            onDispose.ForEach(a => a());
            onDispose.Clear();
            base.Dispose(disposing);
        }

        [HttpPost]
        public HttpResponseMessage Login(LoginRequest request)
        {
            if (ModelState.IsValid)
            {
                var response = Request.CreateResponse(new LoginResponse()
                {
                    Success = true
                });

                var cookie = FormsAuthentication.GetAuthCookie(request.Username, false, "/");
                response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value) 
                    { 
                        Domain = cookie.Domain, 
                        Expires = cookie.Expires, 
                        HttpOnly = cookie.HttpOnly, 
                        Path = cookie.Path, 
                        Secure = cookie.Secure 
                    }
                });
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
        public CreateLoginResponse CreateLogin(CreateLoginRequest request)
        {
            return Dummy<CreateLoginResponse>();
        }

        #endregion

        #region Reset Password

        [HttpPost]
        public GetUserChallengeQuestionsResponse GetUserChallengeQuestions(GetUserChallengeQuestionsRequest request)
        {
            return Dummy<GetUserChallengeQuestionsResponse>();
        }

        [HttpPost]
        public SendResetPasswordEmailResponse SendResetPasswordEmail(SendResetPasswordEmailRequest request)
        {
            return Dummy<SendResetPasswordEmailResponse>();
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
