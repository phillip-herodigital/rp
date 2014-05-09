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
        IEnumerable<IOffer> LoadOffers(Address serviceAddress, IEnumerable<IServiceCapability> serviceCapabilities, bool isNewService);
        IConnectDatePolicy LoadConnectDates(Address serviceAddress, IEnumerable<IServiceCapability> serviceCapabilities, bool isNewService);

        CreditCheckResult CreditCheck(CustomerName name, string ssn, DriversLicense driversLicense, Address billingAddress, AdditionalIdentityInformation identityInformation = null);

        LoadDepositResult LoadDeposit(IEnumerable<IOffer> selectedOffers);
        PlaceOrderResult PlaceOrder(IEnumerable<IOffer> selectedOffers);

    }
}
