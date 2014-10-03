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
        private readonly IAccountService accountService;

        public CreateAccountState(MembershipBuilder membership, IAccountService accountService)
            :base(typeof(AccountInformationState), typeof(CompleteState))
        {
            this.membership = membership;
            this.accountService = accountService;
        }

        protected override async Task<Type> InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            var profile = await membership.CreateUser(context.Username, context.Password, context.Challenges);
            if (profile == null)
            {
                return typeof(CreateFailedState);
            }

            if (await accountService.AssociateAccount(profile.GlobalCustomerId, context.AccountNumber, context.SsnLastFour, "") == null)
            {
                return typeof(CreateFailedState);
            }

            return await base.InternalProcess(context, internalContext);
        }
    }
}
