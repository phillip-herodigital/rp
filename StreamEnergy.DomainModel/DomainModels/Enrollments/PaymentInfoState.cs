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

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            if (!data.IsRenewal)
            {
                yield return context => context.ContactInfo;
                yield return context => context.Language;
                yield return context => context.SecondaryContactInfo;
                yield return context => context.SocialSecurityNumber;
                yield return context => context.TaxId;
                yield return context => context.ContactTitle;
                yield return context => context.DoingBusinessAs;
                yield return context => context.PreferredSalesExecutive;
                yield return context => context.OnlineAccount;
                yield return context => context.SelectedIdentityAnswers;
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn))
                {
                    yield return context => context.PreviousAddress;
                }
            }
            yield return context => context.PaymentInfo;
        }

        public override IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (internalContext.Deposit.Any(e => e.Details.RequiredAmounts.Sum(d => d.DollarAmount) > 0))
            {
                if (context.PaymentInfo == null)
                    yield return new System.ComponentModel.DataAnnotations.ValidationResult("Payment Info Required", new[] { "PaymentInfo" });
            }
            yield break;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (internalContext.Deposit.All(e => e.Details.RequiredAmounts.Sum(d => d.DollarAmount) == 0) && validationResult.MemberNames.Any(m => m.StartsWith("PaymentInfo")))
            {
                context.PaymentInfo = null;
                return true;
            }
            return false;
        }
    }
}
