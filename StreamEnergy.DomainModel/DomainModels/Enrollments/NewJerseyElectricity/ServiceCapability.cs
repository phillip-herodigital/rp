using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyElectricity
{
    [Serializable]
    public class ServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "NewJerseyElectricity";

        public virtual string CapabilityType { get { return Qualifier; } }

        public virtual string PODID { get; set; }

        string ISearchable.GetUniqueField()
        {
            return PODID;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return PODID == ((ServiceCapability)obj).PODID;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (PODID ?? "").GetHashCode();
        }

        public string Zipcode { get; set; }

    }
}
