using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts.Create;

namespace StreamEnergy.DomainModels.Enrollments
{
    class PlaceOrderState : StateBase<UserContext, InternalContext>
    {
        private MembershipBuilder membership;
        public PlaceOrderState(MembershipBuilder membership)
            : base(previousState: typeof(CompleteOrderState), nextState: typeof(OrderConfirmationState))
        {
            this.membership = membership;
        }

        protected override Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            // TODO - place order

            if (context.OnlineAccount != null)
            {
                var profile = membership.CreateUser(context.OnlineAccount.Username, context.OnlineAccount.Password);

                // TODO - link with Stream Connect
            }

            return base.InternalProcess(context, internalContext);
        }
    }
}
