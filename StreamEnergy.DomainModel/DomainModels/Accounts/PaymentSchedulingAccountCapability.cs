using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class PaymentSchedulingAccountCapability : IAccountCapability
    {
        public const string Qualifier = "PaymentScheduling";

        public string CapabilityType
        {
            get { return Qualifier; }
        }

        public bool CanMakeOneTimePayment { get; set; }
    }
}
