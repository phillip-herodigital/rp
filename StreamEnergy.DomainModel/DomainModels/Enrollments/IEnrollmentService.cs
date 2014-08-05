using StreamEnergy.DomainModels.Enrollments.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IEnrollmentService
    {
        Task<Dictionary<Location, LocationOfferSet>> LoadOffers(IEnumerable<Location> serviceLocations);

        Task<IConnectDatePolicy> LoadConnectDates(Location location);

        Task<bool> IsBlockedSocialSecurityNumber(string ssn);

        Task<StreamAsync<IdentityCheckResult>> BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation = null);

        Task<StreamAsync<IdentityCheckResult>> EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult);

        // TODO - will need more inputs
        IEnumerable<LocationOfferDetails<OfferPayment>> LoadOfferPayments(IEnumerable<LocationServices> services);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, too
        IEnumerable<LocationOfferDetails<PlaceOrderResult>> PlaceOrder(IEnumerable<LocationServices> services);

    }
}
