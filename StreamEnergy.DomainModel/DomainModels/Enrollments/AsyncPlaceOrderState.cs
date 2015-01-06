using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class AsyncPlaceOrderState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public AsyncPlaceOrderState(IEnrollmentService enrollmentService)
            : base(typeof(PlaceOrderState), typeof(OrderConfirmationState))
        {
            this.enrollmentService = enrollmentService;
        }

        protected override async System.Threading.Tasks.Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
            {
                internalContext.PlaceOrderAsyncResult = await enrollmentService.EndPlaceOrder(internalContext.PlaceOrderAsyncResult, internalContext.EnrollmentSaveState.Data);
                internalContext.PlaceOrderResult = internalContext.PlaceOrderAsyncResult.Data;

                foreach (var placeOrderResult in internalContext.PlaceOrderResult)
                {
                    if (placeOrderResult.Details.IsSuccess)
                    {
                        if (context.Services.First(s => s.Location == placeOrderResult.Location).SelectedOffers.First(o => o.Offer.Id == placeOrderResult.Offer.Id).WaiveDeposit)
                        {
                            placeOrderResult.Details.IsSuccess = false;
                        }
                    }
                }
            }

            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
                return this.GetType();

            return await base.InternalProcess(context, internalContext);
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !internalContext.PlaceOrderAsyncResult.IsCompleted;
        }
    }
}
