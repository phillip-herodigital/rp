using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class Payment
    {
        public string AccountNumber { get; set; }

        public string ServiceType { get; set; }

        public string ConfirmCode { get; set; }

        public decimal PaymentAmount { get; set; }

        public DateTime PaymentDate { get; set; }

        public string Status { get; set; }

        public string PaymentID { get; set; }
        public string PaymentMode { get; set; }
        public string PaymentAccount { get; set; }
        public string RoutingNumber { get; set; }
        public string PaymentMadeBy { get; set; }
    }
}
