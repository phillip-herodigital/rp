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
        IEnumerable<Tuple<ServiceLocation, IOffer>> LoadOffers(IEnumerable<ServiceLocation> serviceLocations);

        IConnectDatePolicy LoadConnectDates(ServiceLocation location);

        IdentityCheckResult IdentityCheck(Name name, string ssn, DriversLicense driversLicense, Address billingAddress, AdditionalIdentityInformation identityInformation = null);

        // TODO - will need more inputs
        LoadDepositResult LoadDeposit(IEnumerable<ServiceSelection> services);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, too
        PlaceOrderResult PlaceOrder(IEnumerable<ServiceSelection> services);


    }
}
