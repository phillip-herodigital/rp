using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.DCElectricity
{
    [Serializable]
    class RenewalOfferOptionRules: OfferOptionRules
    {
        public const string Qualifier = "DCElectricityRenewal";

        public override string OptionRulesType { get { return RenewalOfferOptionRules.Qualifier; } }

        public override IOfferOption GetInitialOptions()
        {
            return new RenewalOfferOption();
        }
    }
}
