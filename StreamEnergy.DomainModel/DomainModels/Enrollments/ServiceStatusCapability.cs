using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class ServiceStatusCapability : IServiceCapability
    {
        public const string Qualifier = "ServiceStatus";

        public string CapabilityType { get { return ServiceStatusCapability.Qualifier; } }

        public bool IsNewService { get; set; }
    }
}
