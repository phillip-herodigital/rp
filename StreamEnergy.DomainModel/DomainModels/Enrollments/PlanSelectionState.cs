using StreamEnergy.Extensions;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class PlanSelectionState : IState<UserContext, InternalContext>
    {
        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.ServiceAddress.PostalCode5;
            yield return context => context.SelectedOffers;
        }

        public IEnumerable<ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            yield break;
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext context, InternalContext internalContext)
        {
            foreach (var offer in context.SelectedOffers)
            {
                internalContext.OfferOptionRules[offer.Offer.Id] = offer.Offer.GetOfferOptionPolicy().GetOptionRules(context.ServiceAddress, offer.Offer, context.ServiceCapabilities);
            }
            return typeof(AccountInformationState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(LoadOffersState), ref internalContext, ref state))
            {
                return false;
            }

            return true;
        }
    }
}
