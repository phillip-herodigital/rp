using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class SavingEnrollmentState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public SavingEnrollmentState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(SaveEnrollmentState), nextState: typeof(LoadIdentityQuestionsState))
        {
            this.enrollmentService = enrollmentService;
        }

        public override IEnumerable<System.Linq.Expressions.Expression<Func<UserContext, object>>> PreconditionValidations(UserContext data, InternalContext internalContext)
        {
            yield return context => context.Services;
            yield return context => context.ContactInfo;
            yield return context => context.Language;
            yield return context => context.SecondaryContactInfo;
            yield return context => context.SocialSecurityNumber;
            yield return context => context.DriversLicense;
            yield return context => context.OnlineAccount;
            yield return context => context.MailingAddress;
            if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn))
            {
                yield return context => context.PreviousAddress;
            }
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.EnrollmentSaveState.IsCompleted)
            {
                internalContext.EnrollmentSaveState = await enrollmentService.EndSaveEnrollment(internalContext.EnrollmentSaveState);
            }

            if (!internalContext.EnrollmentSaveState.IsCompleted)
            {
                return this.GetType();
            }
            else
            {
                if (internalContext.EnrollmentSaveState.Data == null)
                {
                    // some kind of enrollment error
                    return typeof(EnrollmentErrorState);
                }
                return await base.InternalProcess(context, internalContext);
            }
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !internalContext.EnrollmentSaveState.IsCompleted;
        }
    }
}
