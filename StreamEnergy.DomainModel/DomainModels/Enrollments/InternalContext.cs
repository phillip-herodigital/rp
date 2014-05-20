using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class InternalContext
    {
        public InternalContext()
        {
            OfferOptionRules = new Dictionary<string, IOfferOptionRules>();
        }

        public IEnumerable<IOffer> AllOffers { get; set; }

        public Dictionary<string, IOfferOptionRules> OfferOptionRules { get; private set; }

        public Service.IdentityCheckResult IdentityCheckResult { get; set; }
    }
}
