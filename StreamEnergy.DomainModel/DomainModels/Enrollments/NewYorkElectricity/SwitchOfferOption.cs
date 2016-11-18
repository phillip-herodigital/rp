using System;
using System.ComponentModel.DataAnnotations;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkElectricity
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkElectricitySwitch";

        public override string OptionType
        {
            get { return Qualifier; }
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
