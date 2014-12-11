using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
    public class ServiceCapability : IServiceCapability
    {
        public const string Qualifier = "Mobile";

        public string CapabilityType { get { return Qualifier; } }

        public MobileServiceProvider ServiceProvider { get; set; }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return ServiceProvider == ((ServiceCapability)obj).ServiceProvider;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ ServiceProvider.GetHashCode();
        }
    }
}
