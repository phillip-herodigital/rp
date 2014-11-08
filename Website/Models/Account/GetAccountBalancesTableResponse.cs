using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.MyStream.Models.Angular.GridTable;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountBalancesTableResponse
    {
        public Table<AccountToPay> Accounts { get; set; }
    }
}