using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class AvailablePaymentMethod
    {
        public string PaymentMethodType { get; set; }
    }
}
