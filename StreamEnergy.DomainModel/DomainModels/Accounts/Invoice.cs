using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class Invoice
    {
        public string InvoiceNumber { get; set; }

        public decimal InvoiceAmount { get; set; }

        public DateTime DueDate { get; set; }

        public bool PdfAvailable { get; set; }
    }
}
