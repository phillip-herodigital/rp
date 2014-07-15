using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;
using Microsoft.Practices.Unity;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class CreateAccountState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        private readonly MembershipBuilder membership;

        public CreateAccountState(MembershipBuilder membership)
            :base(typeof(AccountInformationState), typeof(CompleteState))
        {
            this.membership = membership;
        }

        protected override async Task<Type> InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            var profile = membership.CreateUser(context.Username, context.Password, context.Challenges);
            if (profile == null)
            {
                return typeof(CreateFailedState);
            }

            // TODO - register user with Stream Connect

            return await base.InternalProcess(context, internalContext);
        }
    }
}
