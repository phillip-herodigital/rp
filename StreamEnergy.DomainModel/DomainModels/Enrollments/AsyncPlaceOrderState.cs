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

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("OnlineAccount")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SelectedIdentityAnswers")))
                    return true;
            }
            if (!context.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) || !context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("PreviousAddress")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async System.Threading.Tasks.Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
            {
                internalContext.PlaceOrderAsyncResult = await enrollmentService.EndPlaceOrder(internalContext.PlaceOrderAsyncResult, internalContext.EnrollmentSaveState.Data);

                if (internalContext.PlaceOrderAsyncResult.IsCompleted)
                {
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
