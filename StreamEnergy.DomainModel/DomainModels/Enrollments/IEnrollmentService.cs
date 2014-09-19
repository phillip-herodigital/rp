using StreamEnergy.DomainModels.Enrollments.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Specialized;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IEnrollmentService
    {
        Task<Dictionary<Location, LocationOfferSet>> LoadOffers(IEnumerable<Location> serviceLocations);

        Task<PremiseVerificationResult> VerifyPremise(Location location);

        Task<IConnectDatePolicy> LoadConnectDates(Location location);

        Task<bool> IsBlockedSocialSecurityNumber(string ssn);

        Task<StreamAsync<EnrollmentSaveResult>> BeginSaveEnrollment(Guid streamCustomerId, UserContext context, NameValueCollection dpiParameters);

        Task<StreamAsync<EnrollmentSaveResult>> EndSaveEnrollment(StreamAsync<EnrollmentSaveResult> streamAsync, UserContext context);

        Task<StreamAsync<EnrollmentSaveResult>> BeginSaveUpdateEnrollment(Guid streamCustomerId, EnrollmentSaveResult enrollmentSaveResult, UserContext context, NameValueCollection dpiParameters, IEnumerable<LocationOfferDetails<OfferPayment>> offerPayments);

        Task<StreamAsync<IdentityCheckResult>> BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation = null);

        Task<StreamAsync<IdentityCheckResult>> EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult);

        Task<StreamAsync<CreditCheckResult>> BeginCreditCheck(Guid streamCustomerId, Name name, string ssn, Address address);

        Task<StreamAsync<CreditCheckResult>> EndCreditCheck(StreamAsync<CreditCheckResult> asyncResult);

        Task<IEnumerable<LocationOfferDetails<OfferPayment>>> LoadOfferPayments(Guid streamCustomerId, EnrollmentSaveResult streamAsync, IEnumerable<LocationServices> services, InternalContext internalContext);

        Task<IEnumerable<LocationOfferDetails<Payments.PaymentResult>>> PayDeposit(IEnumerable<LocationOfferDetails<OfferPayment>> depositData, IEnumerable<LocationOfferDetails<EnrollmentSaveEntry>> enrollmentSaveEntries, Payments.IPaymentInfo paymentInfo, UserContext context);

        Task<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> PlaceOrder(Guid streamCustomerId, IEnumerable<LocationServices> services, EnrollmentSaveResult originalSaveState, Dictionary<AdditionalAuthorization, bool> additionalAuthorizations);


        Task<bool> PlaceCommercialQuotes(UserContext context);

    }
}
