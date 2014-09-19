﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels.Payments;
using StreamEnergy.Logging;

namespace StreamEnergy.Services.Clients
{
    class PaymentService : IPaymentService
    {
        private readonly HttpClient streamConnectClient;
        private readonly ILogger logger;

        public PaymentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, ILogger logger)
        {
            this.streamConnectClient = client;
            this.logger = logger;
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
    }
}
