using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PaymentInfoState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public PaymentInfoState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(LoadDespositInfoState), nextState: typeof(PayingDepositState))
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
            if (AnyIsWaived(context, internalContext))
            {
                internalContext.EnrollmentSaveState = await enrollmentService.BeginSaveUpdateEnrollment(internalContext.GlobalCustomerId, internalContext.EnrollmentSaveState.Data, context, internalContext.EnrollmentDpiParameters, internalContext.Deposit);
            }
            return await base.InternalProcess(context, internalContext);
        }

        public override IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (CalculateDeposit(context, internalContext) > 0)
            {
                if (context.PaymentInfo == null)
                    yield return new System.ComponentModel.DataAnnotations.ValidationResult("Payment Info Required", new[] { "PaymentInfo" });
            }
            yield break;
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

        private bool AnyIsWaived(UserContext context, InternalContext internalContext)
        {
            return (from entry in internalContext.Deposit
                    let waiveDeposit = !context.Services.FirstOrDefault(svc => svc.Location == entry.Location).SelectedOffers.FirstOrDefault(o => o.Offer.Id == entry.Offer.Id).WaiveDeposit
                    from amount in entry.Details.RequiredAmounts
                    where amount.CanBeWaived && !waiveDeposit
                    select true).Any(t => t);
        }

        private static decimal CalculateDeposit(UserContext context, InternalContext internalContext)
        {
            return (from entry in internalContext.Deposit
                    let selectedOffers = context.Services.FirstOrDefault(svc => svc.Location == entry.Location)
                    let selectedOffer = selectedOffers.SelectedOffers.FirstOrDefault(o => o.Offer.Id == entry.Offer.Id)
                    let waiveDeposit = selectedOffer.WaiveDeposit
                    from amount in entry.Details.RequiredAmounts
                    where !amount.CanBeWaived || !waiveDeposit
                    select amount.DollarAmount).Sum();
        }
    }
}
