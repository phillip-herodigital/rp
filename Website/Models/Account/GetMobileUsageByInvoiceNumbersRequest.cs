using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetMobileUsageByInvoiceIdsRequest
    {
        public string AccountNumber { get; set; }

        public string[] InvoiceIds { get; set; }
    }
}