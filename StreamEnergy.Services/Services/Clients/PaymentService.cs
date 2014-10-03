using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Payments;
using StreamEnergy.Logging;

namespace StreamEnergy.Services.Clients
{
    class PaymentService : IPaymentService
    {
        private readonly HttpClient streamConnectClient;
        private readonly ILogger logger;
        private readonly AccountFactory accountFactory;

        public PaymentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, ILogger logger, AccountFactory accountFactory)
        {
            this.streamConnectClient = client;
            this.logger = logger;
            this.accountFactory = accountFactory;
        }

        async Task<IEnumerable<SavedPaymentInfo>> IPaymentService.GetSavedPaymentMethods(Guid globalCustomerId)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payment-methods");

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return from dynamic entry in (JArray)result.PaymentMethods
                   select new SavedPaymentInfo
                   {
                       Id = new Guid(entry.GlobalPaymentMethodId),
                       DisplayName = entry.PaymentMethodNickname,
                       UnderlyingPaymentType = entry.PaymentAccountType,
                   };
        }

        async Task<Guid> IPaymentService.SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payment-methods", new
                {
                    PaymentAccount = BuildPaymentAccount(paymentInfo),
                    PaymentMethodNickname = displayName
                });

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            if (result.Status == "Success")
            {
                return new Guid(result.GlobalPaymentMethodId);
            }
            return Guid.Empty;
        }

        private object BuildPaymentAccount(IPaymentInfo paymentInfo)
        {
            if (paymentInfo is TokenizedCard)
            {
                var card = paymentInfo as TokenizedCard;
                return new
                {
                    Token = card.CardToken,
                    AccountType = "Unknown",
                    ExpirationDate = new { Month = card.ExpirationDate.Month, Year = card.ExpirationDate.Year },
                    Postal = card.BillingZipCode,                    
                };
            }
            throw new NotImplementedException();
        }

        async Task<bool> IPaymentService.DeletePaymentMethod(Guid globalCustomerId, Guid paymentMethodId)
        {
            var response = await streamConnectClient.DeleteAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payment-methods/" + paymentMethodId);

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return result.Status == "Success";
        }

        async Task<PaymentResult> IPaymentService.OneTimePayment(DateTime paymentDate, decimal amount, string streamAccountNumber, string customerName, string systemOfRecord, IPaymentInfo paymentInfo)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/payments/one-time", new
            {
                PaymentDate = paymentDate,
                InvoiceType = "Standard",
                Amount = amount,
                StreamAccountNumber = streamAccountNumber,
                CustomerName = customerName,
                SystemOfRecord = systemOfRecord,
                PaymentAccount = ToStreamPaymentAccount(customerName, paymentInfo),
                Cvv = GetStreamCvvCode(paymentInfo)
            });
            dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return new DomainModels.Payments.PaymentResult
                {
                    ConfirmationNumber = jobject.ConfirmationNumber,
                    ConvenienceFee = (decimal)jobject.ConvenienceFee.Value,
                };
        }

        async Task<IEnumerable<Account>> IPaymentService.PaymentHistory(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/payments/history/" + globalCustomerId.ToString());

            response.EnsureSuccessStatusCode();
            dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return accountFactory.Merge(existingAccountObjects,
                from pastPayment in ((IEnumerable<dynamic>)jobject.PastPayments)
                group new PastPayment
                {
                    CustomerName = pastPayment.CustomerName,
                    PaidDate = pastPayment.PaidDate,
                    PaymentAmount = (decimal)pastPayment.PaymentAmount.Value,
                    PaymentId = pastPayment.PaymentId,
                } by new AccountFactory.AccountKey
                {
                    StreamConnectCustomerId = globalCustomerId,
                    StreamConnectAccountId = (Guid)pastPayment.GlobalAccountId,
                    AccountNumber = pastPayment.SystemOfRecordAccountNumber,
                    AccountType = pastPayment.ServiceType,
                    SystemOfRecord = pastPayment.SystemOfRecord
                },
                (account, paymentHistory) => account.PaymentHistory = paymentHistory.ToArray()
            );
        }

        private object ToStreamPaymentAccount(string customerName, IPaymentInfo paymentInfo)
        {
            var card = paymentInfo as DomainModels.Payments.TokenizedCard;
            if (card != null)
            {
                return new
                {
                    Token = card.CardToken,
                    AccountType = "Unknown",
                    ExpirationDate = new { Year = card.ExpirationDate.Year, Month = card.ExpirationDate.Month },
                    Name = customerName,
                    Postal = card.BillingZipCode,
                };
            }

            throw new NotImplementedException();
        }

        private object GetStreamCvvCode(IPaymentInfo paymentInfo)
        {
            var card = paymentInfo as DomainModels.Payments.TokenizedCard;
            if (card != null)
            {
                return card.SecurityCode;
            }
            return null;
        }


        Task<AutoPaySetting> IPaymentService.GetAutoPayStatus(DomainModels.Accounts.Account account)
        {
            // TODO - implement service when it is ready
            throw new NotImplementedException();
        }

        Task<bool> IPaymentService.SetAutoPayStatus(DomainModels.Accounts.Account account, AutoPaySetting autoPaySetting)
        {
            // TODO - implement service when it is ready
            throw new NotImplementedException();
        }
    }
}
