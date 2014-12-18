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

        Task<IConnectDatePolicy> LoadConnectDates(Location location, IOffer offer);

        Task<bool> IsBlockedSocialSecurityNumber(string ssn);

        Task<StreamAsync<EnrollmentSaveResult>> BeginSaveEnrollment(Guid streamCustomerId, UserContext context, NameValueCollection dpiParameters);

        Task<StreamAsync<EnrollmentSaveResult>> EndSaveEnrollment(StreamAsync<EnrollmentSaveResult> streamAsync, UserContext context);

        Task<StreamAsync<EnrollmentSaveResult>> BeginSaveUpdateEnrollment(Guid streamCustomerId, EnrollmentSaveResult enrollmentSaveResult, UserContext context, NameValueCollection dpiParameters, IEnumerable<LocationOfferDetails<OfferPayment>> offerPayments);

        Task<bool> DeleteEnrollment(Guid globalCustomerId, Guid enrollmentAccountId);

        Task<StreamAsync<IdentityCheckResult>> BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation = null);

        Task<StreamAsync<IdentityCheckResult>> EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult);

        Task<StreamAsync<CreditCheckResult>> BeginCreditCheck(Guid streamCustomerId, Name name, string ssn, Address address);

        Task<StreamAsync<CreditCheckResult>> EndCreditCheck(StreamAsync<CreditCheckResult> asyncResult);

        Task<IEnumerable<LocationOfferDetails<OfferPayment>>> LoadOfferPayments(Guid streamCustomerId, EnrollmentSaveResult streamAsync, IEnumerable<LocationServices> services, InternalContext internalContext);

        Task<StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>> BeginPlaceOrder(Name name, IEnumerable<LocationServices> services, Dictionary<AdditionalAuthorization, bool> additionalAuthorizations, InternalContext internalContext, Payments.IPaymentInfo paymentInfo);

        Task<StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>> EndPlaceOrder(StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> asyncResult, EnrollmentSaveResult saveState);

        Task<PlaceOrderResult> PlaceCommercialQuotes(UserContext context);

        Task<StreamAsync<RenewalResult>> BeginRenewal(Accounts.Account account, Accounts.ISubAccount subAccount, Enrollments.Renewal.OfferOption renewalOptions);
        Task<StreamAsync<RenewalResult>> EndRenewal(StreamAsync<RenewalResult> asyncResult);

    }
}
