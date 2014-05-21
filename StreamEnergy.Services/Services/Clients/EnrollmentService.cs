using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class EnrollmentService : IEnrollmentService
    {
        IEnumerable<IOffer> IEnrollmentService.LoadOffers(DomainModels.Address serviceAddress, IEnumerable<DomainModels.IServiceCapability> serviceCapabilities)
        {
            throw new NotImplementedException();
        }

        IConnectDatePolicy IEnrollmentService.LoadConnectDates(DomainModels.Address serviceAddress, IEnumerable<DomainModels.IServiceCapability> serviceCapabilities)
        {
            throw new NotImplementedException();
        }

        DomainModels.Enrollments.Service.IdentityCheckResult IEnrollmentService.IdentityCheck(DomainModels.Name name, string ssn, DomainModels.DriversLicense driversLicense, DomainModels.Address billingAddress, AdditionalIdentityInformation identityInformation)
        {
            throw new NotImplementedException();
        }

        DomainModels.Enrollments.Service.LoadDepositResult IEnrollmentService.LoadDeposit(IEnumerable<SelectedOffer> selectedOffers)
        {
            throw new NotImplementedException();
        }

        DomainModels.Enrollments.Service.PlaceOrderResult IEnrollmentService.PlaceOrder(IEnumerable<SelectedOffer> selectedOffers)
        {
            throw new NotImplementedException();
        }
    }
}
