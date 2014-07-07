using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LoadDespositInfoState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadDespositInfoState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(VerifyIdentityState), nextState: typeof(PaymentInfoState))
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
            yield return context => context.OnlineAccount;
            yield return context => context.SelectedIdentityAnswers;
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.Deposit == null ||
                !(from service in (context.Services ?? Enumerable.Empty<LocationServices>())
                 from offer in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                 join internalService in internalContext.Deposit on new { service.Location, offer.Offer.Id } equals new { internalService.Location, internalService.Offer.Id } into internalServices
                 from internalService in internalServices.DefaultIfEmpty()
                 select internalService != null && internalService.Details != null).All(hasDeposit => hasDeposit);
        }

        protected override Task LoadInternalState(UserContext context, InternalContext internalContext)
        {
            var result = enrollmentService.LoadOfferPayments(context.Services);
            internalContext.Deposit = result.ToArray();
            return Task.FromResult<object>(null);
        }
    }
}
