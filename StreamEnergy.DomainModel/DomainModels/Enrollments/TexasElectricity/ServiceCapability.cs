using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    public class ServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "TexasElectricity";

        public virtual string CapabilityType { get { return Qualifier; } }

        public virtual string EsiId { get; set; }

        [Required]
        public string Tdu { get; set; }

        [Newtonsoft.Json.JsonProperty(DefaultValueHandling = Newtonsoft.Json.DefaultValueHandling.IgnoreAndPopulate)]
        [System.ComponentModel.DefaultValue(MeterType.Other)]
        public MeterType MeterType { get; set; }

        string ISearchable.GetUniqueField()
        {
            return EsiId;
        }

        public override bool Equals(object obj)
        {
            if (obj == null || GetType() != obj.GetType())
            {
                return false;
            }

            return EsiId == ((ServiceCapability)obj).EsiId && Tdu == ((ServiceCapability)obj).Tdu;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (EsiId ?? "").GetHashCode() ^ (Tdu ?? "").GetHashCode();
        }

        public string Address { get; set; }

        public string AddressOverflow { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zipcode { get; set; }
    }
}
