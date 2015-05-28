using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class SubmitIdentityState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public SubmitIdentityState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(VerifyIdentityState), nextState: typeof(LoadDespositInfoState))
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
            yield return context => context.TaxId;
            yield return context => context.ContactTitle;
            yield return context => context.DoingBusinessAs;
            yield return context => context.PreferredSalesExecutive;
            yield return context => context.SelectedIdentityAnswers;
            yield return context => context.OnlineAccount;
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            // if it's completed and we have an identity check id, we need to submit the answers
            if (internalContext.IdentityCheck.IsCompleted && !string.IsNullOrEmpty(internalContext.IdentityCheck.Data.IdentityCheckId))
            {
                internalContext.IdentityCheck = await enrollmentService.BeginIdentityCheck(internalContext.GlobalCustomerId, context.ContactInfo.Name, context.SocialSecurityNumber, context.MailingAddress, new AdditionalIdentityInformation
                {
                    PreviousIdentityCheckId = internalContext.IdentityCheck.Data.IdentityCheckId,
                    SelectedAnswers = context.SelectedIdentityAnswers
                });
            }
            else if (!internalContext.IdentityCheck.IsCompleted)
            {
                // if it's not completed, we need to wait for the results
                internalContext.IdentityCheck = await enrollmentService.EndIdentityCheck(internalContext.IdentityCheck);
            }

            if (!internalContext.CreditCheck.IsCompleted)
            {
                internalContext.CreditCheck = await enrollmentService.EndCreditCheck(internalContext.CreditCheck);
            }

            if (!internalContext.IdentityCheck.IsCompleted || !internalContext.CreditCheck.IsCompleted)
            {
                return this.GetType();
            }
            else if (!internalContext.IdentityCheck.Data.HardStop.HasValue)
            {
                context.SelectedIdentityAnswers = new Dictionary<string, string>();
                return await base.InternalProcess(context, internalContext);
            }

            // TODO - based on the credit check, we may have a hard stop, etc.
            throw new NotImplementedException();
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !internalContext.IdentityCheck.IsCompleted || !internalContext.CreditCheck.IsCompleted;
        }
    }
}
