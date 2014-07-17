﻿using Microsoft.Practices.Unity;
using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
            yield return context => context.Services.PartialValidate(e => e.Location.Address.PostalCode5,
                                                                     e => e.Location.Capabilities,
                                                                     e => e.SelectedOffers);
        }

        public override IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            if (context.Services == null || context.Services.Length < 1)
                yield return new ValidationResult("Services Required", new[] { "Services" });
            yield break;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            return validationResult.MemberNames.All(m => System.Text.RegularExpressions.Regex.IsMatch(m, @"SelectedOffers\[[0-9]+\]\.OfferOption"));
        }

        protected override Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal)
                return Task.FromResult(typeof(LoadDespositInfoState));
            else
                return Task.FromResult(typeof(AccountInformationState));
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.OfferOptionRules == null ||
                !(from service in (context.Services ?? Enumerable.Empty<LocationServices>())
                 from offer in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                 join internalService in internalContext.OfferOptionRules on new { service.Location, offer.Offer.Id } equals new { internalService.Location, internalService.Offer.Id } into internalServices
                 from internalService in internalServices.DefaultIfEmpty()
                 select internalService != null && internalService.Details != null).All(hasOptionRule => hasOptionRule);
        }

        protected override Task LoadInternalState(UserContext context, InternalContext internalContext)
        {
            internalContext.OfferOptionRules = (from service in context.Services
                                                where service.SelectedOffers != null
                                                from offer in service.SelectedOffers
                                                select new Service.LocationOfferDetails<IOfferOptionRules>
                                                {
                                                    Location = service.Location,
                                                    Offer = offer.Offer,
                                                    Details = offer.Offer.GetOfferOptionPolicy(container).GetOptionRules(service.Location, offer.Offer)
                                                }).ToArray();
            return Task.FromResult<object>(null);
        }
    }
}
