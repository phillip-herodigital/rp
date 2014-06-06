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

        public override IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(ResetPasswordContext context, object internalContext)
        {
            if (context.Username != null)
            {
                if (Membership.GetUser(context.Username) == null)
                {
                    yield return new ValidationResult("Unknown Username", new[] { "Username" });
                }
            }
        }

        protected override Type InternalProcess(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.Username);

            context.ChallengeQuestions = profile.ChallengeQuestions.ToDictionary(c => c.QuestionKey, c => (string)null);

            return base.InternalProcess(context, internalContext);
        }
    }
}
