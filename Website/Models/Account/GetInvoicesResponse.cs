using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetInvoicesResponse
    {
        public Table<Invoice> Invoices { get; set; }
    }
}