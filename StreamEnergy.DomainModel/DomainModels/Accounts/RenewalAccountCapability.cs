using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class RenewalAccountCapability : IAccountCapability
    {
        public const string Qualifier = "Renewal";

        public string CapabilityType
        {
            get { return RenewalAccountCapability.Qualifier; }
        }

        public bool IsEligible { get; set; }

        public DateTime RenewalDate { get; set; }

        public int EligibilityWindowInDays { get; set; }
    }
}
