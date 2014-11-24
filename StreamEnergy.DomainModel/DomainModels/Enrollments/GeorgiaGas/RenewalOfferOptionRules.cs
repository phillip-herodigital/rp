using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    class RenewalOfferOptionRules: OfferOptionRules
    {
        public const string Qualifier = "GeorgiaGasRenewal";

        public override string OptionRulesType { get { return RenewalOfferOptionRules.Qualifier; } }
    }
}
