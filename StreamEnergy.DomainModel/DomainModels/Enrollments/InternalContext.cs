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
        }

        public Dictionary<Location, LocationOfferSet> AllOffers { get; set; }

        public StreamAsync<Service.IdentityCheckResult> IdentityCheck { get; set; }

        public IEnumerable<Service.LocationOfferDetails<IOfferOptionRules>> OfferOptionRules { get; set; }

        public IEnumerable<Service.LocationOfferDetails<OfferPayment>> Deposit { get; set; }

        public IEnumerable<Service.LocationOfferDetails<Service.PlaceOrderResult>> PlaceOrderResult { get; set; }

        public Guid GlobalCustomerId { get; set; }
    }
}
