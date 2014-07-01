using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class AccountGrouping 
    {
        public string AccountNumber { get; set; }
        public string SubAccountLabel { get; set; }
        public IEnumerable<ISubAccount> SubAccounts { get; set; }
    }
}
