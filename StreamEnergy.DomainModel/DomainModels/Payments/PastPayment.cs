using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Payments
{
    [Serializable]
    public class PastPayment
    {
        public string CustomerName { get; set; }
        public decimal PaymentAmount { get; set; }
        public DateTime PaidDate { get; set; }
        public string PaymentId { get; set; }
    }
}
