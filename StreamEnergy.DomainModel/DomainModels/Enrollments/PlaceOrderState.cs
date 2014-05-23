using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class PlaceOrderState : StateBase<UserContext, InternalContext>
    {
        public PlaceOrderState()
            : base(previousState: typeof(CompleteOrderState), nextState: typeof(OrderConfirmationState))
        {

        }

        protected override Type InternalProcess(UserContext context, InternalContext internalContext)
        {
            // TODO - place order
            return base.InternalProcess(context, internalContext);
        }
    }
}
