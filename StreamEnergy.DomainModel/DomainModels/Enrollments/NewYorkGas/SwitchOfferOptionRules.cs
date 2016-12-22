using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    class SwitchOfferOptionRules : OfferOptionRules
    {
        public const string Qualifier = "NewYorkGasSwitch";

        public override string OptionRulesType { get { return SwitchOfferOptionRules.Qualifier; } }

    }
}
