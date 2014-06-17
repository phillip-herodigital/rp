using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class NotificationSetting
    {
        public bool Web { get; set; }
        public bool Email { get; set; }
        public bool Sms { get; set; }
    }
}