﻿using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Accounts.Create;

namespace StreamEnergy.DomainModels.Enrollments
{
    class PlaceOrderState : StateBase<UserContext, InternalContext>
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
            if (context.IsRenewal || !context.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("PreviousAddress")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                internalContext.PlaceOrderResult = (await enrollmentService.PlaceOrder(internalContext.GlobalCustomerId, context.Services, internalContext.EnrollmentSaveState.Data, context.AdditionalAuthorizations)).ToArray();
            }
            else
            {
                await enrollmentService.PlaceCommercialQuotes(context);
                internalContext.PlaceOrderResult = Enumerable.Empty<Service.LocationOfferDetails<Service.PlaceOrderResult>>();
            }
            
            if (context.OnlineAccount != null)
            {
                await membership.CreateUser(context.OnlineAccount.Username, context.OnlineAccount.Password, globalCustomerId: internalContext.GlobalCustomerId);
            }

            return await base.InternalProcess(context, internalContext);
        }
    }
}
