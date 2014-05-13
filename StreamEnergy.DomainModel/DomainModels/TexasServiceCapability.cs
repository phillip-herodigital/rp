using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class TexasServiceCapability : IServiceCapability
    {
        public const string capabilityType = "TexasElectricity";

        public string CapabilityType { get { return capabilityType; } }

        public string EsiId { get; set; }

        [Required]
        public string Tdu { get; set; }

        // TODO - meter type? dwelling type?
    }
}
