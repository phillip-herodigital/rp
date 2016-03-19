using System;
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
        private readonly DomainModels.Payments.IPaymentService paymentService;

        public AsyncPlaceOrderState(IEnrollmentService enrollmentService, DomainModels.Accounts.IAccountService accountService, ICurrentUser currentUser, MembershipBuilder membership, DomainModels.Payments.IPaymentService paymentService)
            : base(typeof(PlaceOrderState), typeof(OrderConfirmationState))
        {
            this.enrollmentService = enrollmentService;
            this.accountService = accountService;
            this.currentUser = currentUser;
            this.membership = membership;
            this.paymentService = paymentService;
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
                    var paymentInfo = ((DomainModels.Payments.TokenizedCard)context.PaymentInfo);
                    var nickname = paymentInfo.Type + " - " + paymentInfo.CardToken.Substring(paymentInfo.CardToken.Length - 4);
                    IEnumerable<Account> accounts = Enumerable.Empty<Account>(); 
                    Guid paymentMethodID = Guid.Empty;
                    if (context.EnrolledInAutoPay)
                    {
                        accounts = await accountService.GetAccounts(internalContext.GlobalCustomerId);
                        paymentMethodID = await paymentService.SavePaymentMethod(internalContext.GlobalCustomerId, paymentInfo, nickname);
                    }
                    bool hasAllMobile = internalContext.PlaceOrderResult.All(o => o.Offer.OfferType == "Mobile");
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
                        if (context.EnrolledInAutoPay && paymentMethodID != Guid.Empty)
                        {
                            var account = accounts.FirstOrDefault(a => a.AccountNumber == placeOrderResult.Details.ConfirmationNumber);
                            await paymentService.SetAutoPayStatus(internalContext.GlobalCustomerId, account.StreamConnectAccountId, new DomainModels.Payments.AutoPaySetting
                                {
                                    IsEnabled = true,
                                    PaymentMethodId = paymentMethodID
                                },
                                paymentInfo.SecurityCode);
                        }
                    }
                    if (hasAllMobile && internalContext.PlaceOrderResult.Any(o => o.Details.PaymentConfirmation.Status != "Success"))
                    {
                        context.PaymentError = true;
                        return typeof(CompleteOrderState);
                    }
                        
                }
            }

            if (!internalContext.PlaceOrderAsyncResult.IsCompleted)
                return this.GetType();

            if (context.W9BusinessData != null)
                return typeof(GenerateW9State);
            if (context.OnlineAccount != null)
            {
                var profile = await membership.CreateUser(context.OnlineAccount.Username, context.OnlineAccount.Password, globalCustomerId: internalContext.GlobalCustomerId, email: context.ContactInfo.Email.Address);
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
