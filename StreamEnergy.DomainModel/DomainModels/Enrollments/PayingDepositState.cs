using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PayingDepositState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;
        
        public PayingDepositState(IEnrollmentService enrollmentService)
            : base(typeof(PaymentInfoState), typeof(CompleteOrderState))
        {
            this.enrollmentService = enrollmentService;
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
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) && data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                {
                    yield return context => context.PreviousAddress;
                }
            }
            yield return context => context.PaymentInfo;
        }

        protected override async System.Threading.Tasks.Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (internalContext.EnrollmentSaveState != null)
            {
                if (!internalContext.EnrollmentSaveState.IsCompleted)
                {
                    internalContext.EnrollmentSaveState = await enrollmentService.EndSaveEnrollment(internalContext.EnrollmentSaveState, context);
                }

                if (!internalContext.EnrollmentSaveState.IsCompleted)
                {
                    return this.GetType();
                }
            }

            return await base.InternalProcess(context, internalContext);
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (validationResult.MemberNames.Any(m => m.StartsWith("PaymentInfo")) && CalculateDeposit(context, internalContext) == 0)
            {
                context.PaymentInfo = null;
                return true;
            }
            return false;
        }

        private static decimal CalculateDeposit(UserContext context, InternalContext internalContext)
        {
            return (from entry in internalContext.Deposit
                    let waiveDeposit = !context.Services.FirstOrDefault(svc => svc.Location == entry.Location).SelectedOffers.FirstOrDefault(o => o.Offer.Id == entry.Offer.Id).WaiveDeposit
                    from amount in entry.Details.RequiredAmounts
                    where !amount.CanBeWaived || !waiveDeposit
                    select amount.DollarAmount).Sum();
        }
    }
}
