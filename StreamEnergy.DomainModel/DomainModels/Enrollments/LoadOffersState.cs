using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class LoadOffersState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadOffersState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(ServiceInformationState), nextState: typeof(PlanSelectionState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            yield return context => context.Services.PartialValidate(e => e.Location.Address.PostalCode5,
                                                                     e => e.Location.Capabilities);
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.AllOffers == null || !context.Services.Select(s => s.Location).All(loc => internalContext.AllOffers.ContainsKey(loc));
        }

        protected override async Task LoadInternalState(UserContext data, InternalContext internalContext)
        {
            foreach (var loc in data.Services.Select(s => s.Location).Except(internalContext.LocationVerifications == null ? Enumerable.Empty<Location>() : internalContext.LocationVerifications.Keys))
            {
                if (loc.Address.Line1 != null)
                {
                    internalContext.LocationVerifications[loc] = await enrollmentService.VerifyPremise(loc);
                }
            }

            internalContext.AllOffers = Combine(internalContext.AllOffers, await enrollmentService.LoadOffers(
                data.Services
                    .Select(s => s.Location)
                    .Except(internalContext.AllOffers == null ? Enumerable.Empty<Location>() : internalContext.AllOffers.Keys)
                    .Where(loc => !internalContext.LocationVerifications.ContainsKey(loc) || internalContext.LocationVerifications[loc] == PremiseVerificationResult.Success)
                ));
        }

        private Dictionary<Location, LocationOfferSet> Combine(Dictionary<Location, LocationOfferSet> dictionary1, Dictionary<Location, LocationOfferSet> dictionary2)
        {
            if (dictionary1 == null || dictionary2 == null)
            {
                return dictionary1 ?? dictionary2;
            }
            return dictionary1.Concat(dictionary2).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
        }
    }
}
