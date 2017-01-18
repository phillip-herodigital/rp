using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.MobileApp.models
{
    public class MobileAddPaymentRequest
    {
        public string Nickname { get; set; }
        public string AccountOwnerName { get; set; }
        public string PaymentType { get; set; }

        // CC specific fields
        public string CardToken { get; set; }
        public string CardType { get; set; }
        public string ExpirationDate { get; set; }
        public string BillingZipCode { get; set; }
        public string SecurityCode { get; set; }

        // Banking specific fields
        public string BankingCategory { get; set; }
        public string RoutingNumber { get; set; }
        public string AccountToken { get; set; }
    }
}