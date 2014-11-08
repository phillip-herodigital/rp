using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class InvoiceExtensionAccountCapability : IAccountCapability
    {
        public const string Qualifier = "InvoiceExtensionCapability";
        
        public string CapabilityType
        {
            get { return Qualifier; }
        }

        public bool CanRequestExtension { get; set; }
    }
}
