using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountBalancesResponse
    {
        public IEnumerable<AccountToPay> Accounts { get; set; }
    }
}