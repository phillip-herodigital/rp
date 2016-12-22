using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.MarylandElectricity
{
    [Serializable]
    class SwitchOfferOptionRules : OfferOptionRules
    {
        public const string Qualifier = "MarylandElectricitySwitch";

        public override string OptionRulesType { get { return SwitchOfferOptionRules.Qualifier; } }

    }
}
