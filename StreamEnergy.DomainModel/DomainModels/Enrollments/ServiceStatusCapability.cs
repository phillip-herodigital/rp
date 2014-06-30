using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class ServiceStatusCapability : IServiceCapability
    {
        public const string Qualifier = "ServiceStatus";

        public string CapabilityType { get { return ServiceStatusCapability.Qualifier; } }

        public bool IsNewService { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return IsNewService == ((ServiceStatusCapability)obj).IsNewService;
        }

        public override int GetHashCode()
        {
            return CapabilityType.GetHashCode() ^ IsNewService.GetHashCode();
        }
    }
}
