using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.SelectedIdentityAnswers;
            yield return context => context.PaymentInfo;
            yield return context => context.AgreeToTerms;
            yield return context => context.OnlineAccount;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal)
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("ContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("Language")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SecondaryContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SocialSecurityNumber")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("DriversLicense")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("OnlineAccount")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SelectedIdentityAnswers")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            internalContext.PlaceOrderResult = (await enrollmentService.PlaceOrder(context.Services)).ToArray();
            
            return await base.InternalProcess(context, internalContext);
        }

    }
}
