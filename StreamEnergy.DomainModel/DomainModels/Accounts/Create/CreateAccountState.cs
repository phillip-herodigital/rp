using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class CreateAccountState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        public CreateAccountState()
            :base(typeof(AccountInformationState), typeof(CompleteState))
        {
        }

        protected override Type InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            var user = Membership.CreateUser(context.Username, context.Password);

            if (user == null)
            {
                return typeof(CreateFailedState);
            }

            return base.InternalProcess(context, internalContext);
        }
    }
}
