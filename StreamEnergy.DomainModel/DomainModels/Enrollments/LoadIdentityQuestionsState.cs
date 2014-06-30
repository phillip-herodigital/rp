using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class LoadIdentityQuestionsState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public LoadIdentityQuestionsState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(AccountInformationState), nextState: typeof(VerifyIdentityState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations()
        {
            yield return context => context.Services;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.OnlineAccount;
        }

        protected override Type InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.IdentityCheckResult.HardStop.HasValue)
            {
                return base.InternalProcess(context, internalContext);
            }
            // TODO - based on the credit check, we may have a hard stop, etc.
            throw new NotImplementedException();
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.IdentityCheckResult == null || (!internalContext.IdentityCheckResult.IdentityAccepted && internalContext.IdentityCheckResult.HardStop != null);
        }

        protected override void LoadInternalState(UserContext context, InternalContext internalContext)
        {
            internalContext.IdentityCheckResult = enrollmentService.IdentityCheck(context.ContactInfo.Name, context.SocialSecurityNumber, context.DriversLicense);
        }
    }
}
