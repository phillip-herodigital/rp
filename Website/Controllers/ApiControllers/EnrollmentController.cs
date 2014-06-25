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
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.Extensions;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item translationItem;
        private readonly StateMachineSessionHelper<UserContext, InternalContext> stateHelper;
        private readonly IStateMachine<UserContext, InternalContext> stateMachine;
        private readonly IValidationService validation;

        public class SessionHelper : StateMachineSessionHelper<UserContext, InternalContext>
        {
            public SessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(EnrollmentController), typeof(DomainModels.Enrollments.ServiceInformationState), storeInternal: true)
            {
            }
        }

        public EnrollmentController(SessionHelper stateHelper, IValidationService validation)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));

            this.stateHelper = stateHelper;
            this.stateMachine = stateHelper.StateMachine;
            this.validation = validation;
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
        public ClientData ClientData(Type currentFinalState)
        {
            var services = stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>();
            var offers = stateMachine.InternalContext.AllOffers ?? new Dictionary<Location, LocationOfferSet>();
            var optionRules = stateMachine.InternalContext.OfferOptionRules ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<IOfferOptionRules>>();
            var deposits = stateMachine.InternalContext.Deposit ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>>();
            var confirmations = stateMachine.InternalContext.PlaceOrderResult ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>>();
            var validations = TranslatedValidationResult.Translate(stateMachine.ValidationResults, translationItem);
            return new ClientData
            {
                Validations = stateMachine.State == currentFinalState ? Enumerable.Empty<TranslatedValidationResult>() : validations,
                ExpectedState = ExpectedState(),
                ContactInfo = stateMachine.Context.ContactInfo,
                DriversLicense = stateMachine.Context.DriversLicense,
                Language = stateMachine.Context.Language,
                SecondaryContactInfo = stateMachine.Context.SecondaryContactInfo,
                Cart = from service in services
                       let locationOfferSet = offers.ContainsKey(service.Location) ? offers[service.Location] : new LocationOfferSet()
                       select new CartEntry
                       {
                           Location = service.Location,
                           OfferInformationByType = (from selection in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                                                     where selection.Offer != null
                                                     select selection.Offer.OfferType).Union(
                                                     from offer in locationOfferSet.Offers
                                                     select offer.OfferType).Union(locationOfferSet.OfferSetErrors.Keys)
                                                     .ToDictionary(offerType => offerType, offerType => new OfferInformation
                                                     {
                                                         OfferSelections = from selectedOffer in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                                                                           where selectedOffer.Offer != null && selectedOffer.Offer.OfferType == offerType
                                                                           select new OfferSelection
                                                                           {
                                                                               OfferId = selectedOffer.Offer.Id,
                                                                               OfferOption = selectedOffer.OfferOption,
                                                                               OptionRules = optionRules.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).FirstOrDefault(),
                                                                               Deposit = deposits.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).SingleOrDefault(),
                                                                               ConfirmationNumber = confirmations.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details.ConfirmationNumber).SingleOrDefault()
                                                                           },
                                                         Errors = (from entry in locationOfferSet.OfferSetErrors
                                                                   where entry.Key == offerType
                                                                   select entry.Value),
                                                         AvailableOffers = (from entry in locationOfferSet.Offers
                                                                            where entry.OfferType == offerType
                                                                            select entry)
                                                     }).ToArray()
                       },
                SelectedIdentityAnswers = null,
                IdentityQuestions = stateMachine.InternalContext.IdentityCheckResult != null ? stateMachine.InternalContext.IdentityCheckResult.IdentityQuestions : null,
            };
        }

        private Models.Enrollment.ExpectedState ExpectedState()
        {
            var validationResults = stateMachine.ValidationResults;
            var members = validationResults.SelectMany(result => result.MemberNames);

            if (members.Any(m => m.StartsWith("AgreeToTerms")) || members.Any(m => m.StartsWith("PaymentInfo")))
            {
                return Models.Enrollment.ExpectedState.ReviewOrder;
            }
            else if (members.Any(m => m.StartsWith("SelectedIdentityAnswers")))
            {
                return Models.Enrollment.ExpectedState.VerifyIdentity;
            }
            else if (members.Any(m => m.StartsWith("Services")))
            {
                if (stateMachine.Context.Services == null || stateMachine.Context.Services.Length == 0 || validation.PartialValidate(stateMachine.Context, ctx => ctx.Services.PartialValidate(s => s.Location.Address.PostalCode5,
                                                                                                            s => s.Location.Capabilities)).Any())
                {
                    return Models.Enrollment.ExpectedState.ServiceInformation;
                }
                else if (validation.PartialValidate(stateMachine.Context, ctx => ctx.Services.PartialValidate(s => s.SelectedOffers), ctx => ctx.Services.PartialValidate(s => s.Location))
                    .Where(val => !val.MemberNames.All(m => System.Text.RegularExpressions.Regex.IsMatch(m, @"SelectedOffers\[[0-9]+\]\.OfferOption")))
                    .Any())
                {
                    return Models.Enrollment.ExpectedState.PlanSelection;
                }
                else
                {
                    return Models.Enrollment.ExpectedState.PlanSettings;
                }
            }
            else if (stateMachine.State == typeof(AccountInformationState))
            {
                return Models.Enrollment.ExpectedState.AccountInformation;
            }
            else if (stateMachine.State == typeof(OrderConfirmationState))
            {
                return Models.Enrollment.ExpectedState.OrderConfirmed;
            }
            else if (stateMachine.State == typeof(VerifyIdentityState))
            {
                return Models.Enrollment.ExpectedState.VerifyIdentity;
            }
            else //if (stateMachine.Context.Services == null || stateMachine.Context.Services.Length == 0)
            {
                return Models.Enrollment.ExpectedState.ServiceInformation;
            }
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ServiceInformation([FromBody]ServiceInformation value)
        {
            stateMachine.Context.Services = (from location in value.Locations
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on location equals service.Location into services
                                             from service in services.DefaultIfEmpty()
                                             select new LocationServices
                                             {
                                                 Location = location,
                                                 SelectedOffers = service != null ? service.SelectedOffers : null
                                             }).ToArray();

            stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData(typeof(DomainModels.Enrollments.AccountInformationState));
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData SelectedOffers([FromBody]SelectedOffers value)
        {
            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location equals oldService.Location into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location equals oldService.Location into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));
            else
                stateMachine.ContextUpdated();

            return ClientData(typeof(DomainModels.Enrollments.AccountInformationState));
        }

        private LocationServices Combine(SelectedOfferSet newSelection, LocationServices oldService, Dictionary<Location, LocationOfferSet> allOffers)
        {
            allOffers = allOffers ?? new Dictionary<Location, LocationOfferSet>();
            var locationOffers = allOffers.ContainsKey(newSelection.Location) ? allOffers[newSelection.Location].Offers : Enumerable.Empty<IOffer>();
            var result = oldService ?? new LocationServices();
            result.Location = newSelection.Location;
            result.SelectedOffers = (from entry in newSelection.OfferIds
                                     join oldSelection in result.SelectedOffers ?? Enumerable.Empty<SelectedOffer>() on entry equals oldSelection.Offer.Id into oldSelections
                                     let offer = locationOffers.Where(offer => offer.Id == entry).FirstOrDefault()
                                     where offer != null
                                     select oldSelections.FirstOrDefault() ??
                                        new SelectedOffer
                                        {
                                            Offer = offer,
                                            OfferOption = null
                                        }).ToArray();
            return result;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData AccountInformation([FromBody]AccountInformation request)
        {
            MapCartToServices(request);

            stateMachine.Context.ContactInfo = request.ContactInfo;
            EnsureTypedPhones(stateMachine.Context.ContactInfo.Phone);
            stateMachine.Context.DriversLicense = request.DriversLicense;
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;

            stateMachine.ContextUpdated();

            MapCartToServices(request);

            stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));

            return ClientData(typeof(DomainModels.Enrollments.VerifyIdentityState));
        }

        private void EnsureTypedPhones(Phone[] phones)
        {
            for (int i = 0; i < phones.Length; i++)
            {
                if (!(phones[i] is TypedPhone))
                {
                    phones[i] = new TypedPhone { Number = phones[i].Number };
                }
            }
        }

        private void MapCartToServices(AccountInformation request)
        {
            var allOffers = stateMachine.InternalContext.AllOffers ?? new Dictionary<Location, LocationOfferSet>(); ;
            stateMachine.Context.Services = (from cartEntry in request.Cart
                                             let locationOffers = allOffers.ContainsKey(cartEntry.Location) ? allOffers[cartEntry.Location].Offers : Enumerable.Empty<IOffer>()
                                             select new LocationServices
                                             {
                                                 Location = cartEntry.Location,
                                                 SelectedOffers = (from type in cartEntry.OfferInformationByType
                                                                   from offerInfo in type.Value.OfferSelections
                                                                   let offer = locationOffers.Where(offer => offer.Id == offerInfo.OfferId).FirstOrDefault()
                                                                   where offer != null
                                                                   select new SelectedOffer
                                                                   {
                                                                       Offer = offer,
                                                                       OfferOption = offerInfo.OfferOption
                                                                   }).ToArray()
                                             }).ToArray();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData VerifyIdentity([FromBody]VerifyIdentity request)
        {
            stateMachine.Context.SelectedIdentityAnswers = request.SelectedIdentityAnswers;

            stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.VerifyIdentityState))
                stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            return ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ConfirmOrder([FromBody]ConfirmOrder request)
        {
            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;

            stateMachine.ContextUpdated();

            stateMachine.Process();

            return ClientData(null);
        }
    }
}