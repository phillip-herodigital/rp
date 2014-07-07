using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class GetUsernameState : StateBase<ResetPasswordContext, object>
    {
        private IUnityContainer container;

        public GetUsernameState(IUnityContainer container)
            : base(null, typeof(VerifyUserState))
        {
            this.container = container;
        }

        protected override Task<Type> InternalProcess(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.DomainPrefix + context.Username);

            if (profile.ChallengeQuestions != null)
            {
                context.Answers = profile.ChallengeQuestions.ToDictionary(c => c.QuestionKey, c => (string)null);
            }
            else
            {
                context.Answers = new Dictionary<Guid, string>();
            }

            return base.InternalProcess(context, internalContext);
        }
    }
}
