using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    class RenewalOfferOptionRules: OfferOptionRules
    {
        public const string Qualifier = "NewYorkGasRenewal";

        public override string OptionRulesType { get { return RenewalOfferOptionRules.Qualifier; } }

        public override IOfferOption GetInitialOptions()
        {
            return new RenewalOfferOption();
        }
    }
}
