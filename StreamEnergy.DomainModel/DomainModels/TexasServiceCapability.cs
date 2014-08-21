using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class TexasServiceCapability : IServiceCapability, ISearchable
    {
        public const string Qualifier = "TexasElectricity";

        public string CapabilityType { get { return Qualifier; } }

        public string EsiId { get; set; }

        [Required]
        public string Tdu { get; set; }

        [Newtonsoft.Json.JsonProperty(DefaultValueHandling = Newtonsoft.Json.DefaultValueHandling.IgnoreAndPopulate)]
        [System.ComponentModel.DefaultValue(TexasMeterType.Other)]
        public TexasMeterType MeterType { get; set; }
        // TODO - dwelling type?

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

            return EsiId == ((TexasServiceCapability)obj).EsiId && Tdu == ((TexasServiceCapability)obj).Tdu;
        }

        public override int GetHashCode()
        {
            return Qualifier.GetHashCode() ^ (EsiId ?? "").GetHashCode() ^ Tdu.GetHashCode();
        }

        public string Address { get; set; }

        public string AddressOverflow { get; set; }

        public string City { get; set; }

        public string State { get; set; }

        public string Zipcode { get; set; }
    }
}
