using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.MyStream.Models.Account
{
    public class PaymentConfirmation
    {
        public string AccountNumber { get; set; }
        public string PaymentConfirmationNumber { get; set; }
        public decimal ConvenienceFee { get; set; }
    }
}
