using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class TexasElectricityCommercialQuoteOptionRules : TexasElectricityOfferOptionRules
    {
        public new const string Qualifier = "TexasElectricityCommercialQuote";

        public override string OptionRulesType { get { return TexasElectricityCommercialQuoteOptionRules.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }
    }
}
