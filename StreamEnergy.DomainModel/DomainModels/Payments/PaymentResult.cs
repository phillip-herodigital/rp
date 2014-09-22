﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public class PaymentResult
    {
        public string ConfirmationNumber { get; set; }

        public decimal ConvenienceFee { get; set; }
    }
}
