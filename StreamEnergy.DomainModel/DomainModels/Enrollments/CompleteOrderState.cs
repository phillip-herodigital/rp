using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class CompleteOrderState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;

        public CompleteOrderState(IEnrollmentService enrollmentService)
            : base(previousState: typeof(LoadDespositInfoState), nextState: typeof(PlaceOrderState))
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
                yield return context => context.SelectedIdentityAnswers;
                yield return context => context.OnlineAccount;
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn))
                {
                    yield return context => context.PreviousAddress;
                }
            }
            yield return context => context.AgreeToTerms;
            yield return context => context.PaymentInfo;
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            internalContext.PlaceOrderResult = (await enrollmentService.PlaceOrder(internalContext.GlobalCustomerId, context.Services, internalContext.EnrollmentSaveState.Data, context.AdditionalAuthorizations)).ToArray();
            
            return await base.InternalProcess(context, internalContext);
        }

    }
}
