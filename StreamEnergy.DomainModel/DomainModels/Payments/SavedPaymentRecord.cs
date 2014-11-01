using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Payments
{
    public class SavedPaymentRecord
    {
        public SavedPaymentInfo PaymentMethod { get; set; }
        public bool UsedInAutoPay { get; set; }
    }
}
