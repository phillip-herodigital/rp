using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "TexasElectricityRenewal";

        public override string OptionType
        {
            get { return RenewalOfferOption.Qualifier; }
        }

    }
}
