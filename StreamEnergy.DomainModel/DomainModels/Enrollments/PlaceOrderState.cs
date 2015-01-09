using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts.Create;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class PlaceOrderState : StateBase<UserContext, InternalContext>
    {
        private readonly MembershipBuilder membership;
        private readonly IEnrollmentService enrollmentService;

        public PlaceOrderState(MembershipBuilder membership, IEnrollmentService enrollmentService)
            : base(previousState: typeof(CompleteOrderState), nextState: typeof(OrderConfirmationState))
        {
            this.membership = membership;
            this.enrollmentService = enrollmentService;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal)
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("ContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("Language")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SecondaryContactInfo")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SocialSecurityNumber")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("DriversLicense")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("MailingAddress")))
                    return true;
            }
            if (context.IsRenewal || context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("OnlineAccount")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SelectedIdentityAnswers")))
                    return true;
            }
            if (context.IsRenewal || !context.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) || !context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("PreviousAddress")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal)
            {
                var svc = context.Services.Single().SelectedOffers.Single();
                if (internalContext.RenewalResult == null)
                {
                    var renewalCapability = context.Services.SelectMany(s => s.Location.Capabilities).OfType<IRenewalCapability>().First();
                    internalContext.RenewalResult = await enrollmentService.BeginRenewal(
                        renewalCapability.Account,
                        renewalCapability.SubAccount,
                        svc.Offer,
                        svc.OfferOption);
                    return this.GetType();
                }
                else
                {
                    internalContext.RenewalResult = await enrollmentService.EndRenewal(internalContext.RenewalResult);
                    if (!internalContext.RenewalResult.IsCompleted)
                    {
                        return this.GetType();
                    }
                }
            }
            else
            {
                internalContext.PlaceOrderAsyncResult = await enrollmentService.BeginPlaceOrder(context, internalContext);
            }
            
            if (context.OnlineAccount != null)
            {
                await membership.CreateUser(context.OnlineAccount.Username, context.OnlineAccount.Password, globalCustomerId: internalContext.GlobalCustomerId, email: context.ContactInfo.Email.Address);
            }

            if (internalContext.PlaceOrderAsyncResult != null)
                return typeof(AsyncPlaceOrderState);
            return await base.InternalProcess(context, internalContext);
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            if (context.IsRenewal && !internalContext.RenewalResult.IsCompleted)
            {
                return true;
            }
            else if (internalContext.PlaceOrderAsyncResult != null && !internalContext.PlaceOrderAsyncResult.IsCompleted)
            {
                return true;
            }

            return base.ForceBreak(context, internalContext);
        }
    }
}
