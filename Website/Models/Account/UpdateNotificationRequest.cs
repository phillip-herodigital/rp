using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateNotificationRequest
    {
        public string AccountNumber { get; set; }
        public string NotificationName { get; set; }

        public NotificationSetting NotificationSetting { get; set; }
    }
}