using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public string LUAN { get; set; }

        [Required]
        public override string PreviousProvider { get; set; }

        protected override void Sanitize()
        {
            if (!string.IsNullOrEmpty(LUAN))
            {
                LUAN = LUAN.Trim();
            }
            base.Sanitize();
        }
    }
}
