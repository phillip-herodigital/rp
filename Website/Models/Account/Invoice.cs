using StreamEnergy.MyStream.Models.Angular.GridTable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class Invoice
    {
        public Invoice()
        {
            Actions = new Dictionary<string, string>();
        }

        [ColumnSchema("Account Number")]
        public string AccountNumber { get; set; }

        [ColumnSchema("Service Type")]
        public string ServiceType { get; set; }

        [ColumnSchema("Invoice Number")]
        public string InvoiceNumber { get; set; }

        [ColumnSchema("Invoice Amount")]
        public string InvoiceAmount { get; set; }

        [ColumnSchema("Due Date")]
        public DateTime DueDate { get; set; }

        [ColumnSchema("Action")]
        public Dictionary<string, string> Actions { get; private set; }

        public bool CanRequestExtension { get; set; }
    }
}