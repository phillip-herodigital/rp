using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.SessionState;
using StreamEnergy.MyStream.Models.Authentication;

namespace StreamEnergy.MyStream.Controllers
{
    public class AuthenticationController : ApiController, IRequiresSessionState
    {
        [HttpPost]
        public LoginResponse Login(LoginRequest request)
        {
            return Dummy<LoginResponse>();
        }

        #region Create Online Account

        [HttpPost]
        public FindAccountResponse FindAccount(FindAccountRequest request)
        {
            return Dummy<FindAccountResponse>();
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
