using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class AccountInformationState : IState<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public AccountInformationState(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services;
            yield return context => context.BillingAddress;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
        }

        public IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            var changedAddresses = context.Services.Select(s => s.Value.Location).Where(loc => ! internalContext.AllOffers.Any(offer => offer.Item1.Address == loc.Address)).ToArray();
            if (changedAddresses.Any())
            {
                internalContext.AllOffers = internalContext.AllOffers.Concat(enrollmentService.LoadOffers(changedAddresses));
            }
            foreach (var entry in context.Services.Values.Select((service, index) => new { service, index }))
            {
                var offers = from offer in internalContext.AllOffers
                             where offer.Item1.Address == entry.service.Location.Address
                             select offer.Item2.Id;

                foreach (var selectedEntry in entry.service.SelectedOffers.Values.Select((offer, index) => new { offer, index }))
                {
                    if (!offers.Contains(selectedEntry.offer.Offer.Id))
                    {
                        selectedEntry.offer.Offer = null;
                        yield return new ValidationResult("Offer Required", new[] { "Services[" + entry.index + "].Value.SelectedOffers[" + selectedEntry.index + "].Offer" });
                    }
                }
            }
            yield break;
        }

        bool IState<UserContext, InternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            return false;
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext context, InternalContext internalContext)
        {
            return typeof(LoadIdentityQuestionsState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(PlanSelectionState), ref internalContext, ref state))
            {
                return false;
            }

            return true;
        }
    }
}
