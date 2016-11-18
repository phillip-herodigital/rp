using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkGasSwitch";
        
        public override string OptionType
        {
            get { return Qualifier; }
        }

        [Required]
        public string PreviousAccountNumber { get; set; }

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
