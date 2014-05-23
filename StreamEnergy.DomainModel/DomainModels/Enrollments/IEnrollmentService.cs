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
        IEnumerable<Tuple<Location, IOffer>> LoadOffers(IEnumerable<Location> serviceLocations);

        IConnectDatePolicy LoadConnectDates(Location location);

        IdentityCheckResult IdentityCheck(Name name, string ssn, DriversLicense driversLicense, Address billingAddress, AdditionalIdentityInformation identityInformation = null);

        // TODO - will need more inputs
        LoadDepositResult LoadDeposit(IEnumerable<LocationServices> services);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, too
        PlaceOrderResult PlaceOrder(IEnumerable<LocationServices> services);


    }
}
