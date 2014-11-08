using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    class SwitchOfferOptionRules : OfferOptionRules
    {
        public const string Qualifier = "GeorgiaGasSwitch";

        public override string OptionRulesType { get { return SwitchOfferOptionRules.Qualifier; } }

    }
}
