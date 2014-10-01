using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    public class FindAccountState : StateBase<CreateAccountContext, CreateAccountInternalContext>
    {
        private IAccountService service;

        public FindAccountState(IAccountService service)
            : base(null, typeof(AccountInformationState))
        {
            this.service = service;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<CreateAccountContext, object>>> PreconditionValidations(CreateAccountContext data, CreateAccountInternalContext internalContext)
        {
            yield return context => context.AccountNumber;
            yield return context => context.SsnLastFour;
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            // No blockers for online account already exists
            yield break;
            //if (context.AccountNumber == "1234")
            //{
            //    yield return new ValidationResult("Online Account Already Exists", new[] { "AccountNumber" });
            //}
        }

        protected override async Task<Type> InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            internalContext.GlobalCustomerId = await service.CreateStreamConnectCustomer();
            internalContext.Account = await service.AssociateAccount(internalContext.GlobalCustomerId, context.AccountNumber, context.SsnLastFour, "First Account");

            if (internalContext.Account == null)
            {
                // account not found
                return this.GetType();
            }

            await service.GetAccountDetails(internalContext.Account);

            context.Customer = internalContext.Account.Details.ContactInfo;            
            context.Address = internalContext.Account.Details.BillingAddress;
            return await base.InternalProcess(context, internalContext);
        }
    }
}
