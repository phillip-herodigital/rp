using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.DCElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public override string OptionType
        {
            get { return RenewalOfferOption.Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
