using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class CompleteOrderState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public CompleteOrderState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(LoadDespositInfoState), nextState: typeof(PlaceOrderState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services;
            yield return context => context.BillingAddress;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.SelectedIdentityAnswers;
            yield return context => context.PaymentInfo;
            yield return context => context.AgreeToTerms;
        }

        protected override Type InternalProcess(UserContext context, InternalContext internalContext)
        {
            internalContext.PlaceOrderResult = enrollmentService.PlaceOrder(context.Services.Values);

            return base.InternalProcess(context, internalContext);
        }

    }
}
