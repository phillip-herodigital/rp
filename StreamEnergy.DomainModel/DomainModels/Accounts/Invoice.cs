using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class Invoice
    {
        public string AccountNumber { get; set; }

        public string ServiceType { get; set; }

        public string InvoiceNumber { get; set; }

        public decimal InvoiceAmount { get; set; }

        public DateTime DueDate { get; set; }

        public bool IsPaid { get; set; }
        public bool CanRequestExtension { get; set; }
    }
}
