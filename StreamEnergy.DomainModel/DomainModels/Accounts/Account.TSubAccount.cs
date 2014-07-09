using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    
    public class Account<TSubAccount> : Account
        where TSubAccount : ISubAccount
    {
        public new IEnumerable<TSubAccount> SubAccounts
        {
            get
            {
                if (base.SubAccounts != null)
                    return base.SubAccounts.Cast<TSubAccount>();
                return null;
            }
        }
    }
}
