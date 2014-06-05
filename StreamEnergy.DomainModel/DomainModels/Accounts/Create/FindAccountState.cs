using System;
using System.Collections.Generic;
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
            :base(null, typeof(AccountInformationState))
        {
            this.service = service;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<CreateAccountContext, object>>> PreconditionValidations()
        {
            yield return context => context.AccountNumber;
            yield return context => context.SsnLastFour;
        }

        protected override Type InternalProcess(CreateAccountContext context, CreateAccountInternalContext internalContext)
        {
            // TODO - load from service
            context.Customer = new CustomerContact
            {
                Name = new Name { First = "John", Last = "Smith" },
                PrimaryPhone = new Phone { Number = "555-555-4545" },
                Email = new Email { Address = "test@example.com" }
            };
            context.Address = new Address
            {
                Line1="123 Test Ave",
                City = "Dallas",
                StateAbbreviation = "TX",
                PostalCode5 = "75201"
            };
            return base.InternalProcess(context, internalContext);
        }
    }
}
