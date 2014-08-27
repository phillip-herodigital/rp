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

        Task<bool> VerifyPremise(Location location);

        Task<IConnectDatePolicy> LoadConnectDates(Location location);

        Task<bool> IsBlockedSocialSecurityNumber(string ssn);

        Task<StreamAsync<EnrollmentSaveResult>> BeginSaveEnrollment(Guid streamCustomerId, UserContext context);

        Task<StreamAsync<EnrollmentSaveResult>> EndSaveEnrollment(StreamAsync<EnrollmentSaveResult> streamAsync);

        Task UpdateEnrollment(Guid guid, StreamAsync<EnrollmentSaveResult> streamAsync, UserContext context);

        Task<StreamAsync<IdentityCheckResult>> BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation = null);

        Task<StreamAsync<IdentityCheckResult>> EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult);

        // TODO - will need more inputs
        Task<IEnumerable<LocationOfferDetails<OfferPayment>>> LoadOfferPayments(IEnumerable<LocationServices> services);

        // TODO - how do we pay deposits?

        // TODO - needs customer info, too
        Task<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> PlaceOrder(Guid streamCustomerId, IEnumerable<LocationServices> services, EnrollmentSaveResult originalSaveState, Dictionary<AdditionalAuthorization, bool> additionalAuthorizations);

    }
}
