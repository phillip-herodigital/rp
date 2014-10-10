using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public class PaymentRecord
    {
        public string AccountNumber { get; set; }

        public decimal Amount { get; set; }

        public IPaymentInfo Method { get; set; }

        public DateTime Date { get; set; }
    }
}
