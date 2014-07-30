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

        IConnectDatePolicy LoadConnectDates(Location location);

        IdentityCheckResult IdentityCheck(Name name, string ssn, DriversLicense driversLicense, AdditionalIdentityInformation identityInformation = null);

        // TODO - will need more inputs
        IEnumerable<LocationOfferDetails<OfferPayment>> LoadOfferPayments(IEnumerable<LocationServices> services);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, too
        IEnumerable<LocationOfferDetails<PlaceOrderResult>> PlaceOrder(IEnumerable<LocationServices> services);


    }
}
