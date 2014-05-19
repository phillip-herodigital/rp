using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class TexasOfferOptionRules : IOfferOptionRules
    {
        public IConnectDatePolicy ConnectDates { get; set; }
    }
}
