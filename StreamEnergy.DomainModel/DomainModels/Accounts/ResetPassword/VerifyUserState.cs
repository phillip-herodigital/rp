using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    public class VerifyUserState : StateBase<ResetPasswordContext, object>
    {
        private IUnityContainer container;

        public VerifyUserState(IUnityContainer container)
            : base(typeof(GetUsernameState), typeof(SentEmailState))
        {
            this.container = container;
        }

        public override IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(ResetPasswordContext context, object internalContext)
        {
            var profile = UserProfile.Locate(container, context.Username);

            throw new NotImplementedException();
        }
    }
}
