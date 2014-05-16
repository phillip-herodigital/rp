using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class PlaceOrderState : IState<UserContext, InternalContext>
    {
        public IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.ServiceAddress;
            yield return context => context.SelectedOffers;
            yield return context => context.BillingAddress;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            // TODO - identity questions
            // TODO - select payment method
            // TODO - confirm TOSA, etc.
        }

        public IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
            yield break;
        }

        public bool IsFinal
        {
            get { return false; }
        }

        public Type Process(UserContext context, InternalContext internalContext)
        {
            // TODO - place order
            return typeof(OrderConfirmationState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(CompleteOrderState), ref internalContext, ref state))
            {
                return false;
            }

            return true;
        }
    }
}
