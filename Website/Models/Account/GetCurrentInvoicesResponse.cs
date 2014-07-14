using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetCurrentInvoicesResponse
    {
        public Angular.GridTable.Table<AccountToPay> Accounts { get; set; }
    }
}