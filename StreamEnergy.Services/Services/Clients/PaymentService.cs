using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json.Linq;
using StackExchange.Redis;
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
        private readonly Func<System.Web.HttpSessionStateBase> sessionResolver;

        public PaymentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, ILogger logger, AccountFactory accountFactory, Func<System.Web.HttpSessionStateBase> sessionResolver)
        {
            this.streamConnectClient = client;
            this.logger = logger;
            this.accountFactory = accountFactory;
            this.sessionResolver = sessionResolver;
        }

        async Task<IEnumerable<SavedPaymentRecord>> IPaymentService.GetSavedPaymentMethods(Guid globalCustomerId)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payment-methods");

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return (from dynamic entry in (JArray)result.PaymentMethods
                    select new SavedPaymentRecord
                    {
                        UsedInAutoPay = ((JArray)entry.CustomerAccounts).Count != 0,
                        PaymentMethod = new SavedPaymentInfo
                            {
                                Id = Guid.Parse(entry.GlobalPaymentMethodId.ToString()),
                                RedactedData = "********" + entry.PaymentAccountNumberLast4,
                                DisplayName = entry.PaymentMethodNickname,
                                UnderlyingPaymentType = ToPortalPaymentType(entry.PaymentAccountType.ToString()),
                                UnderlyingType = entry.PaymentAccountType.ToString(),
                            }
                    }).ToArray();
        }

        private string ToPortalPaymentType(string streamConnectPaymentType)
        {
            switch (streamConnectPaymentType)
            {
                case "Savings":
                case "Checking":
                    return TokenizedBank.Qualifier;
                default:
                case "Unknown":
                    return TokenizedCard.Qualifier;
            }
        }

        async Task<Guid> IPaymentService.SavePaymentMethod(Guid globalCustomerId, IPaymentInfo paymentInfo, string displayName)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payment-methods", new
                {
                    PaymentAccount = ToStreamPaymentAccount(paymentInfo),
                    PaymentMethodNickname = displayName
                });

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            if (result.Status == "Success")
            {
                return Guid.Parse(result.GlobalPaymentMethodId.ToString());
            }
            return Guid.Empty;
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
            if (paymentInfo is SavedPaymentInfo)
            {
                throw new NotImplementedException();
            }
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/payments/one-time", new
            {
                PaymentDate = paymentDate,
                InvoiceType = "Standard",
                Amount = amount,
                StreamAccountNumber = streamAccountNumber,
                CustomerName = customerName,
                SystemOfRecord = systemOfRecord,
                PaymentAccount = ToStreamPaymentAccount(paymentInfo, customerName),
                Cvv = GetStreamCvvCode(paymentInfo)
            });
            dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            if (jobject.Status == "Success")
            {
                return new DomainModels.Payments.PaymentResult
                {
                    ConfirmationNumber = jobject.ConfirmationNumber,
                    ConvenienceFee = (decimal)jobject.ConvenienceFee.Value,
                };
            }
            else
            {
                return new DomainModels.Payments.PaymentResult { };
            }
        }

        async Task<PaymentResult> IPaymentService.OneTimePayment(DateTime paymentDate, decimal amount, string customerName, DomainModels.Accounts.Account account, IPaymentInfo paymentInfo, string securityCode)
        {
            if (paymentInfo is SavedPaymentInfo)
            {
                var savedInfo = paymentInfo as SavedPaymentInfo;
                var response = await streamConnectClient.PostAsJsonAsync("/api/v1/payments/saved-method", new
                {
                    GlobalPaymentMethodId = savedInfo.Id,
                    GlobalCustomerId = account.StreamConnectCustomerId,
                    AccountNumber = account.AccountNumber,
                    SystemOfRecord = account.SystemOfRecord,
                    PaymentAmount = amount,
                    Cvv = securityCode //GetStreamCvvCode(paymentInfo)
                });
                dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

                
                if (jobject.Status == "Success")
                {
                    return new DomainModels.Payments.PaymentResult
                    {
                        ConfirmationNumber = jobject.ConfirmationNumber,
                        ConvenienceFee = (decimal)jobject.ConvenienceFee.Value,
                    };
                }
                else
                {
                    return new DomainModels.Payments.PaymentResult { };
                }
            }
            else
            {
                return await ((IPaymentService)this).OneTimePayment(paymentDate, amount, account.AccountNumber, customerName, account.SystemOfRecord, paymentInfo);
            }
        }

        async Task<IEnumerable<Account>> IPaymentService.PaymentHistory(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/payments");

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


        private object ToStreamPaymentAccount(IPaymentInfo paymentInfo, string customerName = null)
        {
            var card = paymentInfo as DomainModels.Payments.TokenizedCard;
            var bank = paymentInfo as DomainModels.Payments.TokenizedBank;
            if (card != null)
            {
                return new
                {
                    Token = card.CardToken,
                    AccountType = card.Type,
                    ExpirationDate = new { Year = card.ExpirationDate.Year, Month = card.ExpirationDate.Month },
                    Name = card.Name,
                    Postal = card.BillingZipCode,
                };
            }
            else if (bank != null)
            {
                return new
                {
                    Name = bank.Name,
                    Token = bank.AccountToken,
                    AccountType = bank.Category.ToString("g"),
                    BankRoutingNumber = bank.RoutingNumber
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


        async Task<AutoPaySetting> IPaymentService.GetAutoPayStatus(DomainModels.Accounts.Account account, bool forceRefresh)
        {
            if (forceRefresh || account.AutoPay == null)
            {
                var response = await streamConnectClient.GetAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString() + "/autopay");
                response.EnsureSuccessStatusCode();

                dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

                var methodId = jobject.AutoPayGlobalPaymentMethodId == null ? Guid.Empty : Guid.Parse(jobject.AutoPayGlobalPaymentMethodId.ToString());

                account.AutoPay = new AutoPaySetting
                {
                    IsEnabled = jobject.AutoPayEnabled,
                    PaymentMethodId = methodId
                };
            }
            return account.AutoPay;
        }

        async Task<bool> IPaymentService.SetAutoPayStatus(DomainModels.Accounts.Account account, AutoPaySetting autoPaySetting, string securityCode)
        {
            account.AutoPay = null;
            if (autoPaySetting.IsEnabled)
            {
                var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString() + "/autopay",
                    new 
                    {
                        GlobalPaymentMethodId = autoPaySetting.PaymentMethodId,
                        Cvv = securityCode
                    });
                response.EnsureSuccessStatusCode();

                dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

                return jobject.Status.ToString() == "Success";
            }
            else
            {
                var response = await streamConnectClient.DeleteAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString() + "/autopay");
                response.EnsureSuccessStatusCode();

                dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

                return jobject.Status.ToString() == "Success";
            }
        }

        Task<bool> IPaymentService.DetectDuplicatePayments(PaymentRecord[] paymentRecords)
        {
            var session = sessionResolver();
            if (session == null)
                return Task.FromResult(false);

            foreach (var entry in paymentRecords)
            {
                var sessionKey = (string)GetSessionKey(entry);
                if (session[sessionKey] != null)
                {
                    return Task.FromResult(true);
                }
            }
            return Task.FromResult(false);
        }

        Task<bool> IPaymentService.RecordForDuplicatePayments(PaymentRecord[] paymentRecords)
        {
            var session = sessionResolver();
            if (session == null)
                return Task.FromResult(true);

            foreach (var entry in paymentRecords)
            {
                var sessionKey = (string)GetSessionKey(entry);
                session[sessionKey] = entry.AccountNumber;
            }
            return Task.FromResult(true);
        }

        private string GetSessionKey(PaymentRecord entry)
        {
            return Json.Stringify(entry);
        }

    }
}
