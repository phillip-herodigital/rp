using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class CompleteOrderState : IState<UserContext, InternalContext>
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
            yield return context => context.SelectedIdentityAnswers;
            // TODO - select payment method
            // TODO - confirm TOSA, etc.
        }

        public IEnumerable<System.ComponentModel.DataAnnotations.ValidationResult> AdditionalValidations(UserContext context, InternalContext internalContext)
        {
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
            return typeof(PlaceOrderState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(LoadDespositInfoState), ref internalContext, ref state))
            {
                return false;
            }

            return true;
        }
    }
}
