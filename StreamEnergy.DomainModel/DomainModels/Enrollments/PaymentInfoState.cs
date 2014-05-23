using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PaymentInfoState : StateBase<UserContext, InternalContext>
    {
        public PaymentInfoState()
            : base(previousState: typeof(LoadDespositInfoState), nextState: typeof(CompleteOrderState))
        {

        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.BillingAddress;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.SelectedIdentityAnswers;
            yield return context => context.PaymentInfo;
        }

        public override IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (internalContext.Deposit.Amount > 0)
            {
                if (context.PaymentInfo == null)
                    yield return new System.ComponentModel.DataAnnotations.ValidationResult("Payment Info Required", new[] { "PaymentInfo" });
            }
            yield break;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (internalContext.Deposit.Amount == 0 && validationResult.MemberNames.Any(m => m.StartsWith("PaymentInfo")))
            {
                // TODO - verify that the amount being 0 is all we need to check, such as prior debt, etc.
                context.PaymentInfo = null;
                return true;
            }
            return false;
        }
    }
}
