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
        public CompleteOrderState()
            : base(previousState: typeof(LoadDespositInfoState), nextState: typeof(PlaceOrderState))
        {
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
                yield return context => context.MailingAddress;
                if (data.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) && data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
                {
                    yield return context => context.PreviousAddress;
                }
            }
            if (!data.IsRenewal && !data.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                yield return context => context.SelectedIdentityAnswers;
                yield return context => context.OnlineAccount;
            }
            yield return context => context.AgreeToTerms;
            yield return context => context.PaymentInfo;
        }

        public override Task<RestoreInternalStateResult> RestoreInternalState(IStateMachine<UserContext, InternalContext> stateMachine, Type state)
        {
            if (stateMachine.Context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
                previousState = typeof(AccountInformationState);

            return base.RestoreInternalState(stateMachine, state);
        }

    }
}
