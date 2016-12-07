using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaGas
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public new const string Qualifier = "PennsylvaniaGasSwitch";
        
        public override string OptionType
        {
            get { return SwitchOfferOption.Qualifier; }
        }

        [Required]
        public string PreviousAccountNumber { get; set; }

        [Required]
        public override string PreviousProvider { get; set; }

        protected override void Sanitize()
        {
            if (!string.IsNullOrEmpty(PreviousAccountNumber))
            {
                PreviousAccountNumber = PreviousAccountNumber.Trim();
            }
            base.Sanitize();
        }


    }
}
