using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class CustomerTypeCapability : IServiceCapability
    {
        public const string Qualifier = "CustomerType";

        public string CapabilityType { get { return CustomerTypeCapability.Qualifier; } }

        public EnrollmentCustomerType CustomerType { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return CustomerType == ((CustomerTypeCapability)obj).CustomerType;
        }

        public override int GetHashCode()
        {
            return CapabilityType.GetHashCode() ^ CustomerType.GetHashCode();
        }
    }
}
