using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class ServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "GeorgiaGas";

        public virtual string CapabilityType { get { return Qualifier; } }

        public virtual string AglcPremisesNumber { get; set; }

        string ISearchable.GetUniqueField()
        {
            return AglcPremisesNumber;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return AglcPremisesNumber == ((ServiceCapability)obj).AglcPremisesNumber;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (AglcPremisesNumber ?? "").GetHashCode();
        }

        public string Zipcode { get; set; }

    }
}
