using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class TexasElectricityOfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "TexasElectricity";

        public string OptionRulesType { get { return ServiceStatusCapability.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }
    }
}
