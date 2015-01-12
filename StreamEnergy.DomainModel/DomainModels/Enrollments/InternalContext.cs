using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class InternalContext
    {
        public InternalContext()
        {
            LocationVerifications = new Dictionary<Location, PremiseVerificationResult>();
        }

        public Dictionary<Location, LocationOfferSet> AllOffers { get; set; }

        public StreamAsync<Service.IdentityCheckResult> IdentityCheck { get; set; }

        public StreamAsync<Service.EnrollmentSaveResult> EnrollmentSaveState { get; set; }

        public IEnumerable<Service.LocationOfferDetails<IOfferOptionRules>> OfferOptionRules { get; set; }

        public IEnumerable<Service.LocationOfferDetails<OfferPayment>> Deposit { get; set; }

        public StreamAsync<IEnumerable<Service.LocationOfferDetails<Service.PlaceOrderResult>>> PlaceOrderAsyncResult { get; set; }

        public IEnumerable<Service.LocationOfferDetails<Service.PlaceOrderResult>> PlaceOrderResult { get; set; }

        public Guid GlobalCustomerId { get; set; }

        public Dictionary<Location, PremiseVerificationResult> LocationVerifications { get; private set; }

        public StreamAsync<CreditCheckResult> CreditCheck { get; set; }

        public NameValueCollection EnrollmentDpiParameters { get; set; }

        public StreamAsync<RenewalResult> RenewalResult { get; set; }

        public Guid W9StorageId { get; set; }
    }
}
