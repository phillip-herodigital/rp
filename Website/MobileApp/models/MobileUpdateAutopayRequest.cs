using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.MobileApp.models
{
    public class MobileUpdateAutopayRequest
    {
        public string AccountNumber { get; set; }
        public bool Enabled { get; set; }
        public string PaymentMethodId { get; set; }
    }
}