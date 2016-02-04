﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Processes;
using System.Web.Security;
using System.Web;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Accounts.Create;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class AsyncPlaceOrderState : StateBase<UserContext, InternalContext>
    {
        private readonly IEnrollmentService enrollmentService;
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly ICurrentUser currentUser;
        private readonly MembershipBuilder membership;

        public AsyncPlaceOrderState(IEnrollmentService enrollmentService, DomainModels.Accounts.IAccountService accountService, ICurrentUser currentUser, MembershipBuilder membership)
            : base(typeof(PlaceOrderState), typeof(OrderConfirmationState))
        {
            this.enrollmentService = enrollmentService;
            this.accountService = accountService;
            this.currentUser = currentUser;
            this.membership = membership;
        }

        public override bool IgnoreValidation(System.ComponentModel.DataAnnotations.ValidationResult validationResult, UserContext context, InternalContext internalContext)
        {
            if (context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType == EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("OnlineAccount")))
                    return true;
                if (validationResult.MemberNames.Any(m => m.StartsWith("SelectedIdentityAnswers")))
                    return true;
            }
            if (!context.Services.SelectMany(svc => svc.Location.Capabilities).OfType<ServiceStatusCapability>().Any(cap => cap.EnrollmentType == EnrollmentType.MoveIn) || !context.Services.SelectMany(s => s.Location.Capabilities).OfType<CustomerTypeCapability>().Any(ct => ct.CustomerType != EnrollmentCustomerType.Commercial))
            {
                if (validationResult.MemberNames.Any(m => m.StartsWith("PreviousAddress")))
                    return true;
            }
            return base.IgnoreValidation(validationResult, context, internalContext);
        }

        protected override async System.Threading.Tasks.Task<Type> InternalProcess(UserContext context, InternalContext internalContext)
        {
            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
            {
                internalContext.PlaceOrderAsyncResult = await enrollmentService.EndPlaceOrder(internalContext.PlaceOrderAsyncResult, internalContext.EnrollmentSaveState.Data);

                if (internalContext.PlaceOrderAsyncResult.IsCompleted)
                {
                    internalContext.PlaceOrderResult = internalContext.PlaceOrderAsyncResult.Data;
                    foreach (var placeOrderResult in internalContext.PlaceOrderResult)
                    {
                        if (placeOrderResult.Details.IsSuccess)
                        {
                            if (context.Services.Any(s => s.SelectedOffers.Any(o => o.Offer.OfferType != "TexasElectricity" || o.WaiveDeposit))
                                && 
                                (internalContext.IdentityCheck == null || !internalContext.IdentityCheck.Data.IdentityAccepted))
                            {
                                placeOrderResult.Details.IsSuccess = false;
                            }
                        }
                    }
                }
            }

            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
                return this.GetType();

            if (context.W9BusinessData != null)
                return typeof(GenerateW9State);
            if (context.OnlineAccount != null)
            {
                var profile = await membership.CreateUser(context.OnlineAccount.Username, context.OnlineAccount.Password, globalCustomerId: internalContext.GlobalCustomerId, email: context.ContactInfo.Email.ToString());
                var account = await accountService.GetAccounts(internalContext.GlobalCustomerId);
                var accountNumber = account.FirstOrDefault().AccountNumber;
                var accountLast4 = account.FirstOrDefault().Details.SsnLastFour;
                await accountService.AssociateAccount(profile.GlobalCustomerId, accountNumber, accountLast4, "");
                var cookie = FormsAuthentication.GetAuthCookie(context.OnlineAccount.Username, false, "/");
                HttpContext.Current.Response.AppendCookie(cookie);
            }
            return await base.InternalProcess(context, internalContext);
        }

        public override bool ForceBreak(UserContext context, InternalContext internalContext)
        {
            return !internalContext.PlaceOrderAsyncResult.IsCompleted;
        }
    }
}
