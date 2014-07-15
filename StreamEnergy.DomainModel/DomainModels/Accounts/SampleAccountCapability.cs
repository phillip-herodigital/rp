using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    class SampleAccountCapability : IAccountCapability
    {
        public string CapabilityType { get; set; }
    }
}
