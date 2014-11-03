using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class AccountBalance
    {
        public decimal Balance { get; set; }
        public DateTime DueDate { get; set; }
    }
}
