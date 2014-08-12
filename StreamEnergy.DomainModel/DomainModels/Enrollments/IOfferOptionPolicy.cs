using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOfferOptionPolicy
    {
        bool AcceptsOptions(IOfferOption offerOption);

        Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer);
    }
}
