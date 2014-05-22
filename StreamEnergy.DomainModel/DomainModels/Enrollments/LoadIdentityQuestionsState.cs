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
            LoadInternalState(context, internalContext);

            if (!internalContext.IdentityCheckResult.HardStop.HasValue)
            {
                return typeof(VerifyIdentityState);
            }
            // TODO - based on the credit check, we may have a hard stop, etc.
            throw new NotImplementedException();
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
            internalContext.IdentityCheckResult = enrollmentService.IdentityCheck(context.ContactInfo.Name, context.SocialSecurityNumber, context.DriversLicense, context.BillingAddress);
        }
    }
}
