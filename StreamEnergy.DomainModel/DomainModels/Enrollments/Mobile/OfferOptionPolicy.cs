using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    class OfferOptionPolicy : IOfferOptionPolicy
    {
        bool IOfferOptionPolicy.AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is OfferOption;
        }

        System.Threading.Tasks.Task<IOfferOptionRules> IOfferOptionPolicy.GetOptionRules(Location location, IOffer offer)
        {
            return Task.FromResult<IOfferOptionRules>(new OfferOptionRules());
        }
    }
}
