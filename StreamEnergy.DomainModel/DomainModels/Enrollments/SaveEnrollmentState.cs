using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.Processes;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class SaveEnrollmentState : StateBase<UserContext, InternalContext>
    {
        private readonly IAccountService accountService;
        private readonly IEnrollmentService enrollmentService;

        public SaveEnrollmentState(IAccountService accountService, IEnrollmentService enrollmentService)
            : base(previousState: typeof(AccountInformationState), nextState: typeof(SavingEnrollmentState))
        {
            this.accountService = accountService;
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

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return !internalContext.EnrollmentSaveState.IsCompleted;
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (await enrollmentService.IsBlockedSocialSecurityNumber(ssn: context.SocialSecurityNumber))
            {
                internalContext.EnrollmentSaveState = new StreamAsync<Service.EnrollmentSaveResult>
                {
                    IsCompleted = true,
                    Data = new Service.EnrollmentSaveResult
                    {
                    }
                };

            }

            if (internalContext.EnrollmentSaveState == null)
            {
                if (internalContext.GlobalCustomerId == Guid.Empty)
                {
                    internalContext.GlobalCustomerId = await accountService.CreateStreamConnectCustomer(email: context.ContactInfo.Email.Address);
                }
                internalContext.EnrollmentSaveState = await enrollmentService.BeginSaveEnrollment(internalContext.GlobalCustomerId, context);
            }
            else
            {
                await enrollmentService.UpdateEnrollment(internalContext.GlobalCustomerId, internalContext.EnrollmentSaveState, context);
            }

            return await base.InternalProcess(context, internalContext);
        }
    }
}
