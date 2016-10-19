using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkElectricity
{
    [Serializable]
    public class ServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "NewYorkElectricity";

        public virtual string CapabilityType { get { return Qualifier; } }

        public virtual string LUAN { get; set; }

        string ISearchable.GetUniqueField()
        {
            return LUAN;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return LUAN == ((ServiceCapability)obj).LUAN;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (LUAN ?? "").GetHashCode();
        }

        public string Zipcode { get; set; }

    }
}
