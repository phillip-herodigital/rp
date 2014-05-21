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

        public IEnumerable<Tuple<ServiceLocation, IOffer>> AllOffers { get; set; }

        public IEnumerable<Tuple<ServiceLocation, IOffer, IOfferOptionRules>> OfferOptionRulesByAddressOffer { get; set; }

        public Service.IdentityCheckResult IdentityCheckResult { get; set; }

        public Service.LoadDepositResult Deposit { get; set; }

        public Service.PlaceOrderResult PlaceOrderResult { get; set; }
    }
}
