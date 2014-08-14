﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class TexasElectricityMoveInOfferOptionRules : TexasElectricityOfferOptionRules
    {
        public new const string Qualifier = "TexasElectricityMoveIn";

        public override string OptionRulesType { get { return TexasElectricityMoveInOfferOptionRules.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }
    }
}
