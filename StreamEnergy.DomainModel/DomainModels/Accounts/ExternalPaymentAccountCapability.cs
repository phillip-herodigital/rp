using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class ExternalPaymentAccountCapability : IAccountCapability
    {
        public const string Qualifier = "ExternalPayment";

        public string CapabilityType
        {
            get { return Qualifier; }
        }

        public string UtilityProvider { get; set; }
    }
}
