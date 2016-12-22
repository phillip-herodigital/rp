using System;
using System.ComponentModel.DataAnnotations;

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

        public override string PreviousProvider { get; set; }

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
