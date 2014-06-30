using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetNotificationSettingsResponse
    {
        public string AccountNumber { get; set; }

        public NotificationSetting NewDocumentArrives { get; set; }
        public NotificationSetting OnlinePaymentsMade { get; set; }
        public NotificationSetting RecurringPaymentsMade { get; set; }
        public NotificationSetting RecurringProfileExpires { get; set; }
        
        public bool PrintedInvoices { get; set; }
        public bool PromoOptIn { get; set; }
    }
}