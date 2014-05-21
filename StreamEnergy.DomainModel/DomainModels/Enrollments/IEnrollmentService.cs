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
        IEnumerable<IOffer> LoadOffers(Address serviceAddress, IEnumerable<IServiceCapability> serviceCapabilities);
        IConnectDatePolicy LoadConnectDates(Address serviceAddress, IEnumerable<IServiceCapability> serviceCapabilities);

        IdentityCheckResult IdentityCheck(Name name, string ssn, DriversLicense driversLicense, Address billingAddress, AdditionalIdentityInformation identityInformation = null);

        // TODO - will need more inputs
        LoadDepositResult LoadDeposit(IEnumerable<SelectedOffer> selectedOffers);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, at the very least
        PlaceOrderResult PlaceOrder(IEnumerable<SelectedOffer> selectedOffers);

    }
}
