using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.MarylandGas
{
    [Serializable]
    class RenewalOfferOptionRules: OfferOptionRules
    {
        public const string Qualifier = "MarylandGasRenewal";

        public override string OptionRulesType { get { return RenewalOfferOptionRules.Qualifier; } }

        public override IOfferOption GetInitialOptions()
        {
            return new RenewalOfferOption();
        }
    }
}
