using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    class OfferOptionPolicy : IOfferOptionPolicy
    {
        bool IOfferOptionPolicy.AcceptsOptions(IOfferOption offerOption)
        {
            throw new NotImplementedException();
        }

        System.Threading.Tasks.Task<IOfferOptionRules> IOfferOptionPolicy.GetOptionRules(Location location, IOffer offer)
        {
            throw new NotImplementedException();
        }
    }
}
