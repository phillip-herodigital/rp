using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAutoPayStatusResponse
    {
        public string AccountNumber { get; set; }
        public StreamEnergy.DomainModels.Payments.AutoPaySetting AutoPay { get; set; }
    }
}