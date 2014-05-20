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

        CreditCheckResult CreditCheck(Name name, string ssn, DriversLicense driversLicense, Address billingAddress, AdditionalIdentityInformation identityInformation = null);

        LoadDepositResult LoadDeposit(IEnumerable<SelectedOffer> selectedOffers);

        // TODO - needs customer number, at the very least
        PlaceOrderResult PlaceOrder(IEnumerable<SelectedOffer> selectedOffers);

    }
}
