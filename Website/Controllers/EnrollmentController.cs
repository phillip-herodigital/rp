using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;
using Microsoft.Practices.Unity;

namespace StreamEnergy.MyStream.Controllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item translationItem;
        private readonly StateMachineSessionHelper<UserContext, InternalContext> stateHelper;
        private readonly IStateMachine<UserContext, InternalContext> stateMachine;

        public class SessionHelper : StateMachineSessionHelper<UserContext, InternalContext>
        {
            public SessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(EnrollmentController), typeof(DomainModels.Enrollments.ServiceInformationState), storeInternal: true)
            {
            }
        }

        public EnrollmentController(SessionHelper stateHelper)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));

            this.stateHelper = stateHelper;
            this.stateMachine = stateHelper.StateMachine;
        }

        protected override void Dispose(bool disposing)
        {
            stateHelper.Dispose();
            base.Dispose(disposing);
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public void Reset()
        {
            stateHelper.Reset();
        }

        /// <summary>
        /// Gets all the client data, such as for a page refresh
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ClientData()
        {
            var services = stateMachine.Context.Services ?? new Dictionary<string, LocationServices>();
            var offers = stateMachine.InternalContext.AllOffers ?? Enumerable.Empty<Tuple<Location, IOffer>>();
            var optionRules = stateMachine.InternalContext.OfferOptionRules ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<IOfferOptionRules>>();
            var deposits = stateMachine.InternalContext.Deposit ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>>();
            var confirmations = stateMachine.InternalContext.PlaceOrderResult ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>>();
            return new ClientData
            {
                Validations = TranslatedValidationResult.Translate(stateMachine.ValidationResults, translationItem),
                BillingAddress = stateMachine.Context.BillingAddress,
                ContactInfo = stateMachine.Context.ContactInfo,
                DriversLicense = stateMachine.Context.DriversLicense,
                Language = stateMachine.Context.Language,
                SecondaryContactInfo = stateMachine.Context.SecondaryContactInfo,
                EnrollmentLocations = from service in services
                                      select new EnrollmentLocation
                                      {
                                          Id = service.Key,
                                          Location = service.Value.Location,
                                          AvailableOffers = (from entry in offers
                                               where LookupAddressId(entry.Item1) == service.Key
                                               select entry.Item2),
                                          OfferSelections = from selectedOffer in (service.Value.SelectedOffers == null ? Enumerable.Empty<SelectedOffer>() : service.Value.SelectedOffers)
                                                            select new OfferSelection
                                                            {
                                                                OfferId = selectedOffer.Offer.Id,
                                                                OfferOption = selectedOffer.OfferOption,
                                                                OptionRules = optionRules.Where(entry => LookupAddressId(entry.Location) == service.Key && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).FirstOrDefault(),
                                                                Deposit = deposits.Where(entry => LookupAddressId(entry.Location) == service.Key && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).SingleOrDefault(),
                                                                ConfirmationNumber = confirmations.Where(entry => LookupAddressId(entry.Location) == service.Key && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details.ConfirmationNumber).SingleOrDefault()
                                                            },
                                      },
                SelectedIdentityAnswers = null,
                IdentityQuestions = stateMachine.InternalContext.IdentityCheckResult != null ? stateMachine.InternalContext.IdentityCheckResult.IdentityQuestions : null,
            };
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ServiceInformation([FromBody]ServiceInformation value)
        {
            stateMachine.Context.Services = (from location in value.Locations
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<KeyValuePair<string, LocationServices>>()) on location.Key equals service.Key into services
                                             from service in services.DefaultIfEmpty()
                                             select new
                                             {
                                                 Key = location.Key,
                                                 Value = new LocationServices
                                                     {
                                                         Location = location.Value,
                                                         SelectedOffers = service.Value != null ? service.Value.SelectedOffers : null
                                                     }
                                             }).ToDictionary(e => e.Key, e => e.Value);

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData SelectedOffers([FromBody]SelectedOffers value)
        {
            foreach (var entry in stateMachine.Context.Services)
            {
                var addressId = entry.Key;
                if (value.OfferIds.ContainsKey(addressId))
                {
                    entry.Value.SelectedOffers = (from offerId in value.OfferIds[addressId]
                                                  let offer = LookupOffer(addressId, offerId)
                                                  where offer != null
                                                  select new SelectedOffer
                                                  {
                                                      Offer = offer
                                                  }).ToArray();
                }
            }

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        private string LookupAddressId(Location serviceLocation)
        {
            return stateMachine.Context.Services.Where(s => s.Value.Location.Address.Equals(serviceLocation.Address)).Select(s => s.Key).FirstOrDefault();
        }

        private IOffer LookupOffer(string addressId, string offerId)
        {
            return stateMachine.InternalContext.AllOffers.Where(offer => LookupAddressId(offer.Item1) == addressId && offer.Item2.Id == offerId).Select(offer => offer.Item2).FirstOrDefault();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData AccountInformation([FromBody]AccountInformation request)
        {
            stateMachine.Context.Services = (from location in request.Locations
                                             join service in (stateMachine.Context.Services ?? new Dictionary<string, LocationServices>()) on location.Key equals service.Key into services
                                             from service in services.DefaultIfEmpty()
                                             select new
                                             {
                                                 Key = location.Key,
                                                 Value = new LocationServices
                                                 {
                                                     Location = location.Value,
                                                     SelectedOffers = service.Value != null ? service.Value.SelectedOffers : null
                                                 }
                                             }).ToDictionary(e => e.Key, e => e.Value);

            stateMachine.Context.ContactInfo = request.ContactInfo;
            stateMachine.Context.BillingAddress = request.BillingAddress;
            stateMachine.Context.DriversLicense = request.DriversLicense;
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;
            if (request.OfferOptions != null)
            {
                foreach (var addressId in request.OfferOptions.Keys)
                {
                    foreach (var offerId in request.OfferOptions[addressId].Keys)
                    {
                        stateMachine.Context.Services[addressId].SelectedOffers.Single(offer => offer.Offer.Id == offerId).OfferOption = request.OfferOptions[addressId][offerId];
                    }
                }
            }

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.VerifyIdentityState));

            return ClientData();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData VerifyIdentity([FromBody]VerifyIdentity request)
        {
            stateMachine.Context.SelectedIdentityAnswers = request.SelectedIdentityAnswers;

            if (stateMachine.State == typeof(DomainModels.Enrollments.VerifyIdentityState))
                stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            return ClientData();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ConfirmOrder([FromBody]ConfirmOrder request)
        {
            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;

            stateMachine.Process();

            return ClientData();
        }
    }
}