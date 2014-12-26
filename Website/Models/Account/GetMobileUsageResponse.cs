using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetMobileUsageResponse
    {
        public DateTime LastBillingDate { get; set; }
        public DateTime NextBillingDate { get; set; }

        public double DataUsageLimit { get; set; }
        public IEnumerable<MobileUsage> DeviceUsage { get; set; }
    }
}