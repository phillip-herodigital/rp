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

        public EnrollmentCustomerType CustomerType { get; set; }

        public EnrollmentType EnrollmentType { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return EnrollmentType == ((ServiceStatusCapability)obj).EnrollmentType;
        }

        public override int GetHashCode()
        {
            return CapabilityType.GetHashCode() ^ EnrollmentType.GetHashCode();
        }
    }
}
