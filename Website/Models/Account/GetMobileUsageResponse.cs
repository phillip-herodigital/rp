using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetMobileUsageResponse
    {
        public DateTime BillFromDate { get; set; }
        public DateTime BillToDate { get; set; }
        public string InvoiceId { get; set; }

        public double DataUsageLimit { get; set; }
        public IEnumerable<MobileUsage> DeviceUsage { get; set; }
    }
}