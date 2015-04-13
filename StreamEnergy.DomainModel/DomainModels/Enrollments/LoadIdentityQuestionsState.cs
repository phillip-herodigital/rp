using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    class LoadIdentityQuestionsState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;
        private readonly Accounts.IAccountService accountService;

        public LoadIdentityQuestionsState(IEnrollmentService enrollmentService, Accounts.IAccountService accountService)
            : base(previousState: typeof(SaveEnrollmentState), nextState: typeof(VerifyIdentityState))
        {
            this.enrollmentService = enrollmentService;
            this.accountService = accountService;
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
            if (context.IsRenewal || !internalContext.IdentityCheck.Data.HardStop.HasValue)
            {
                if (context.IsRenewal || internalContext.IdentityCheck.Data.IdentityQuestions.Length == 0)
                {
                    context.SelectedIdentityAnswers = new Dictionary<string, string>();
                    return typeof(LoadDespositInfoState);
                }
                return await base.InternalProcess(context, internalContext);
            }
            else
            {
                return typeof(IdentityCheckHardStopState);
            }
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return !context.IsRenewal && (internalContext.IdentityCheck == null || !internalContext.IdentityCheck.IsCompleted || (!internalContext.IdentityCheck.Data.IdentityAccepted && internalContext.IdentityCheck.Data.HardStop != null));
        }

        protected override async Task LoadInternalState(UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal)
                return;

            if (internalContext.IdentityCheck == null)
            {
                if (await enrollmentService.IsBlockedSocialSecurityNumber(ssn: context.SocialSecurityNumber))
                {
                    internalContext.IdentityCheck = new StreamAsync<Service.IdentityCheckResult>
                    {
                        IsCompleted = true,
                        Data = new Service.IdentityCheckResult
                        {
                            HardStop = Service.IdentityCheckHardStop.Blacklisted
                        }
                    };
                    return;
                }

                if (internalContext.GlobalCustomerId == Guid.Empty)
                {
                    var customer = await accountService.CreateStreamConnectCustomer(email: context.ContactInfo.Email.Address);
                    internalContext.GlobalCustomerId = customer.GlobalCustomerId;
                }
                internalContext.IdentityCheck = new StreamAsync<Service.IdentityCheckResult>
                {
                    IsCompleted = true,
                    Data = await enrollmentService.LoadIdentityQuestions(internalContext.GlobalCustomerId, context.ContactInfo.Name, context.SocialSecurityNumber, context.MailingAddress)
                };
                internalContext.CreditCheck = await enrollmentService.BeginCreditCheck(internalContext.GlobalCustomerId, context.ContactInfo.Name, context.SocialSecurityNumber, context.PreviousAddress ?? context.MailingAddress);
                context.SelectedIdentityAnswers = null;

                if (!internalContext.IdentityCheck.IsCompleted)
                {
                    // This first identity check shouldn't be async... here's to making sure it isn't.
                    throw new NotSupportedException();
                }
            }
        }
    }
}
