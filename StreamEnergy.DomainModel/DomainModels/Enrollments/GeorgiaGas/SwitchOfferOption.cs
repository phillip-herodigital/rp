using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public const string Qualifier = "GeorgiaGasSwitch";
        
        public override string OptionType
        {
            get { return SwitchOfferOption.Qualifier; }
        }

        [Required]
        public string AglcNumber { get; set; }

        protected override void Sanitize()
        {
            if (!string.IsNullOrEmpty(AglcNumber))
            {
                AglcNumber = AglcNumber.Trim();
            }
            base.Sanitize();
        }
    }
}
