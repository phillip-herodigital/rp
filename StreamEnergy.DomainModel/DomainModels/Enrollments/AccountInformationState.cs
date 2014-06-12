using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class AccountInformationState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public AccountInformationState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(PlanSelectionState), nextState: typeof(LoadIdentityQuestionsState))
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
        }

        public override void Sanitize(UserContext context, InternalContext internalContext)
        {
            var changedAddresses = context.Services.Select(s => s.Location).Where(loc => !internalContext.AllOffers.Any(offer => offer.Item1.Address == loc.Address)).ToArray();
            if (changedAddresses.Any())
            {
                internalContext.AllOffers = internalContext.AllOffers.Concat(enrollmentService.LoadOffers(changedAddresses)).ToArray();
            }

            if (context.Services != null)
            {
                foreach (var service in context.Services)
                {
                    var offers = from offer in internalContext.AllOffers
                                 where offer.Item1.Address == service.Location.Address
                                 select offer.Item2.Id;

                    if (service.SelectedOffers != null)
                    {
                        service.SelectedOffers = (from selectedOffer in service.SelectedOffers
                                                  where offers.Contains(selectedOffer.Offer.Id)
                                                  select selectedOffer).ToArray();
                    }
                }
            }
        }
    }
}
