using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Logging;
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
            if (!data.IsRenewal)
            {
                yield return context => context.ContactInfo;
                yield return context => context.Language;
                yield return context => context.SecondaryContactInfo;
                yield return context => context.SocialSecurityNumber;
                yield return context => context.TaxId;
                yield return context => context.ContactTitle;
                yield return context => context.DoingBusinessAs;
                yield return context => context.PreferredSalesExecutive;
                yield return context => context.OnlineAccount;
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) && data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                {
                    yield return context => context.PreviousAddress;
                }
            }
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!context.IsRenewal && !internalContext.EnrollmentSaveState.IsCompleted)
            {
                internalContext.EnrollmentSaveState = await enrollmentService.EndSaveEnrollment(internalContext.EnrollmentSaveState, context);
            }

            if (!context.IsRenewal && !internalContext.EnrollmentSaveState.IsCompleted)
            {
                return this.GetType();
            }
            else
            {
                if (!context.IsRenewal && internalContext.EnrollmentSaveState.Data == null)
                {
                    // some kind of enrollment error
                    return typeof(EnrollmentErrorState);
                }

                if (context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
                {
                    // currently aren't doing id/credit check for commercial customers
                    return typeof(CompleteOrderState);
                }
                return await base.InternalProcess(context, internalContext);
            }
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !context.IsRenewal && !internalContext.EnrollmentSaveState.IsCompleted;
        }
    }
}
