﻿using Microsoft.Practices.Unity;
using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PlanSelectionState : IState<UserContext, InternalContext>
    {
        private readonly IUnityContainer container;

        public PlanSelectionState(IUnityContainer container)
        {
            this.container = container;
        }

        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.ServiceAddress.PostalCode5;
            yield return context => context.SelectedOffers;
        }

        public IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            yield break;
        }

        bool IState<UserContext, InternalContext>.IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult)
        {
            return validationResult.MemberNames.All(m => System.Text.RegularExpressions.Regex.IsMatch(m, @"SelectedOffers\[[0-9]+\]\.OfferOption"));
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext context, InternalContext internalContext)
        {
            LoadInternalState(context, internalContext);
            return typeof(AccountInformationState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(LoadOffersState), ref internalContext, ref state))
            {
                return false;
            }

            LoadInternalState(stateMachine.Context, internalContext);

            return true;
        }

        private void LoadInternalState(UserContext context, InternalContext internalContext)
        {
            foreach (var offer in context.SelectedOffers)
            {
                internalContext.OfferOptionRules[offer.Offer.Id] = offer.Offer.GetOfferOptionPolicy(container).GetOptionRules(context.ServiceAddress, offer.Offer, context.ServiceCapabilities);
            }
        }
    }
}
