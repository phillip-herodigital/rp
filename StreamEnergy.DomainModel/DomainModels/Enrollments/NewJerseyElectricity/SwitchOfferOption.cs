using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyElectricity
{
    [Serializable]
    public class SwitchOfferOption : OfferOption
    {
        public new const string Qualifier = "NewJerseyElectricitySwitch";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        [Required]
        public string PODID { get; set; }

        [Required]
        public override string PreviousProvider { get; set; }

        protected override void Sanitize()
        {
            if (!string.IsNullOrEmpty(PODID))
            {
                PODID = PODID.Trim();
            }
            base.Sanitize();
        }
    }
}
