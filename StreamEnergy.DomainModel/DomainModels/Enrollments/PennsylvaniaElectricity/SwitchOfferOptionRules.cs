using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaElectricity
{
    [Serializable]
    class SwitchOfferOptionRules : OfferOptionRules
    {
        public const string Qualifier = "PennsylvaniaElectricitySwitch";

        public override string OptionRulesType { get { return SwitchOfferOptionRules.Qualifier; } }

    }
}
