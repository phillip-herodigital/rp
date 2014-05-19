using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class TexasElectricityOfferOptionPolicy : IOfferOptionPolicy
    {
        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is TexasElectricityOfferOption;
        }
    }
}
