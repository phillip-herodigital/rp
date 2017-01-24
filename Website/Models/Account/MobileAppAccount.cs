using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MobileAppAccount
    {
        public string AccountNumber { get; set; }

        public decimal AmountDue { get; set; }

        public DateTime DueDate { get; set; }

        public Boolean HasAutoPay { get; set; }

        public string AutoPayPaymentMethodId { get; set; }

        public Boolean IsPaperless { get; set; }

        public string BillingDeliveryPreference { get; set; }

        public bool CanMakeOneTimePayment { get; set; }

        public DomainModels.Payments.SavedPaymentRecord[] PaymentMethods { get; set; }

        public string UtilityProvider { get; set; }

        public string AccountType { get; set; }

        public string SystemOfRecord { get; set; }

//        public string MobileNumber { get; set; }

        public MobileAppPhoneLine[] MobileAppPhoneLines { get; set; }
             
        public DateTime BillingCycleStart { get; set; }

        public DateTime BillingCycleEnd { get; set; }

        public string PlanName { get; set; }

        public string UtilityType { get; set; }

        public decimal PlanRate { get; set; }

        public string PlanRateType { get; set; }

        public DomainModels.Address ServiceAddress { get; set; }

        public MyStream.Models.Account.Invoice[] InvoiceHistory { get; set; }
    }
}