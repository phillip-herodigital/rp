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
            : base(previousState: typeof(AccountInformationState), nextState: typeof(VerifyIdentityState))
        {
            this.enrollmentService = enrollmentService;
            this.accountService = accountService;
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

        protected override Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.IdentityCheck.IsCompleted)
            {
                return Task.FromResult(this.GetType());
            }
            else if (!internalContext.IdentityCheck.Data.HardStop.HasValue)
            {
                return base.InternalProcess(context, internalContext);
            }
            else
            {
                return Task.FromResult(typeof(IdentityCheckHardStopState));
            }
        }

        protected override bool NeedRestoreInternalState(UserContext context, InternalContext internalContext)
        {
            return internalContext.IdentityCheck == null || !internalContext.IdentityCheck.IsCompleted || (!internalContext.IdentityCheck.Data.IdentityAccepted && internalContext.IdentityCheck.Data.HardStop != null);
        }

        protected override async Task LoadInternalState(UserContext context, InternalContext internalContext)
        {
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
                    internalContext.GlobalCustomerId = await accountService.CreateStreamConnectCustomer(email: context.ContactInfo.Email.Address);
                }
                internalContext.IdentityCheck = await enrollmentService.BeginIdentityCheck(internalContext.GlobalCustomerId, context.ContactInfo.Name, context.SocialSecurityNumber, context.Services.First().SelectedOffers.First().OfferOption.BillingAddress);

                if (!internalContext.IdentityCheck.IsCompleted)
                {
                    // This first identity check shouldn't be async... here's to making sure it isn't.
                    throw new NotSupportedException();
                }
            }
        }
    }
}
