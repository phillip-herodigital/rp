using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class InternalContext
    {
        private IEnumerable<Tuple<Location, IOffer>> allOffers;
        public InternalContext()
        {
        }

        public IEnumerable<Tuple<Location, IOffer>> AllOffers
        {
            get { return allOffers; }
            set
            {
                allOffers = value;
            }
        }

        public IEnumerable<Tuple<Location, IOffer, IOfferOptionRules>> OfferOptionRulesByAddressOffer { get; set; }

        public Service.IdentityCheckResult IdentityCheckResult { get; set; }

        public Service.LoadDepositResult Deposit { get; set; }

        public Service.PlaceOrderResult PlaceOrderResult { get; set; }
    }
}
