using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MobileAppPhoneLine
    {
        public string PhoneNumber { get; set; }

        //public double DataUsageLimit { get; set; }

        public IEnumerable<MobileUsage> DeviceUsage { get; set; }

    }
}