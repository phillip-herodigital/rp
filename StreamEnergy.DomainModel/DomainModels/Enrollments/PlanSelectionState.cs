using Microsoft.Practices.Unity;
using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PlanSelectionState : StateBase<UserContext, InternalContext>
    {
        private readonly IUnityContainer container;

        public PlanSelectionState(IUnityContainer container)
            : base(previousState: typeof(LoadOffersState), nextState: typeof(AccountInformationState))
        {
            this.container = container;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services.PartialValidate(e => e.Value.Location.Address.PostalCode5,
                                                                     e => e.Value.Location.Capabilities,
                                                                     e => e.Value.SelectedOffers.PartialValidate(i => i.Offer));
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (context.Services == null || context.Services.Count < 1)
                yield return new ValidationResult("Services Required", new[] { "Services" });
            yield break;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            return validationResult.MemberNames.All(m => System.Text.RegularExpressions.Regex.IsMatch(m, @"SelectedOffers\[[0-9]+\]\.OfferOption"));
        }

        protected override void LoadInternalState(UserContext context, InternalContext internalContext)
        {
            internalContext.OfferOptionRulesByAddressOffer = (from service in context.Services.Values
                                                              where service.SelectedOffers != null
                                                              from offer in service.SelectedOffers
                                                              select Tuple.Create(service.Location, offer.Offer, offer.Offer.GetOfferOptionPolicy(container).GetOptionRules(service.Location, offer.Offer))).ToArray();
        }
    }
}
