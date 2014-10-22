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

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.EnrollmentSaveState == null || !internalContext.EnrollmentSaveState.IsCompleted;
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

            if (context.IsRenewal)
            {
                // no need to save this here
            }
            else
            {
                if (internalContext.EnrollmentSaveState == null)
                {
                    if (internalContext.GlobalCustomerId == Guid.Empty)
                    {
                        var customer = await accountService.CreateStreamConnectCustomer(email: context.ContactInfo.Email.Address);
                        internalContext.GlobalCustomerId = customer.GlobalCustomerId;
                    }
                    internalContext.EnrollmentSaveState = await enrollmentService.BeginSaveEnrollment(internalContext.GlobalCustomerId, context, internalContext.EnrollmentDpiParameters);
                }
                else
                {
                    internalContext.EnrollmentSaveState = await enrollmentService.BeginSaveUpdateEnrollment(internalContext.GlobalCustomerId, internalContext.EnrollmentSaveState.Data, context, internalContext.EnrollmentDpiParameters, internalContext.Deposit);
                }
            }

            return await base.InternalProcess(context, internalContext);
        }
    }
}
