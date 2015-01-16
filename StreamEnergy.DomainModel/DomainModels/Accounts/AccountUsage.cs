using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class AccountUsage
    {
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}
