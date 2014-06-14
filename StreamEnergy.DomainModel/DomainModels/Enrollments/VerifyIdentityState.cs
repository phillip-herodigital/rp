using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class VerifyIdentityState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public VerifyIdentityState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(LoadIdentityQuestionsState), nextState: typeof(LoadDespositInfoState))
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
            yield return context => context.SelectedIdentityAnswers;
        }

        protected override Type InternalProcess(UserContext context, InternalContext internalContext)
        {
            internalContext.IdentityCheckResult = enrollmentService.IdentityCheck(context.ContactInfo.Name, context.SocialSecurityNumber, context.DriversLicense, new AdditionalIdentityInformation
            {
                PreviousIdentityCheckId = internalContext.IdentityCheckResult.IdentityCheckId,
                SelectedAnswers = context.SelectedIdentityAnswers
            });
            return base.InternalProcess(context, internalContext);
        }
    }
}
