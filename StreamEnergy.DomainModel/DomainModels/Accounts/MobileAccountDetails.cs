using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class MobileAccountDetails : AccountDetails
    {
        public DateTime LastBillDate { get; set; }

        public DateTime NextBillDate { get; set; }
    }
}
