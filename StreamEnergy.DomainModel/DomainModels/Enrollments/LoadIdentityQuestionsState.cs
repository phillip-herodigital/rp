using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class LoadIdentityQuestionsState : IState<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadIdentityQuestionsState(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

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
            LoadInternalState(context, internalContext);

            // TODO - based on the credit check, we may have a hard stop, etc.
            return typeof(VerifyIdentityState);
        }

        public bool RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, ref InternalContext internalContext, ref Type state)
        {
            if (!stateMachine.RestoreStateFrom(typeof(AccountInformationState), ref internalContext, ref state))
            {
                return false;
            }

            LoadInternalState(stateMachine.Context, internalContext);
            return true;
        }

        private void LoadInternalState(UserContext context, InternalContext internalContext)
        {
            enrollmentService.CreditCheck(context.ContactInfo.Name, context.SocialSecurityNumber, context.DriversLicense, context.BillingAddress);
            // TODO - something with the result so we know where we're going next
        }
    }
}
