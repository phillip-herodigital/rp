﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.Extensions;
using StreamEnergy.Logging;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item translationItem;
        private readonly StateMachineSessionHelper<UserContext, InternalContext> stateHelper;
        private IStateMachine<UserContext, InternalContext> stateMachine;
        private readonly IValidationService validation;
        private Sitecore.Security.Domains.Domain domain;

        public class SessionHelper : StateMachineSessionHelper<UserContext, InternalContext>
        {
            public SessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(EnrollmentController), typeof(DomainModels.Enrollments.ServiceInformationState), storeInternal: true)
            {
            }
        }

        public EnrollmentController(SessionHelper stateHelper, IValidationService validation, ILogger logger)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));

            this.domain = Sitecore.Context.Site.Domain;
            this.stateHelper = stateHelper;
            this.validation = validation;
        }

        protected override void Initialize(System.Web.Http.Controllers.HttpControllerContext controllerContext)
        {
            Initialize().Wait();
            base.Initialize(controllerContext);
        }

        public async Task Initialize()
        {
            await stateHelper.EnsureInitialized();
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

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<HttpResponseMessage> DemoSetupRenewal()
        {
            stateHelper.Reset();
            await stateHelper.EnsureInitialized();
            stateHelper.Context.IsRenewal = true;
            stateHelper.Context.Services = new LocationServices[]
            {
                new LocationServices 
                { 
                    Location = new Location 
                    { 
                        Address = new Address { Line1 = "3620 Huffines Blvd", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                        Capabilities = new [] { new TexasServiceCapability { EsiId = "123FAKE456", Tdu = "ONCOR" } }
                    },
                    SelectedOffers = new SelectedOffer[] { }
                }
            };
            await stateHelper.StateMachine.Process();

            var response = Request.CreateResponse(HttpStatusCode.Found);
            response.Headers.Location = new Uri(Request.RequestUri, "/enrollment");
            return response;
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
            var standardValidation = (stateMachine.State == currentFinalState ? Enumerable.Empty<ValidationResult>() : stateMachine.ValidationResults);
            IEnumerable<ValidationResult> supplementalValidation;
            var expectedState = ExpectedState(out supplementalValidation);
            var validations = TranslatedValidationResult.Translate(from val in standardValidation.Union(supplementalValidation)
                                                                   group val by val.ErrorMessage + ";" + string.Join(",", val.MemberNames) into val
                                                                   select val.First(), translationItem);
            return new ClientData
            {
                Validations = validations,
                ExpectedState = expectedState,
                IsRenewal = stateMachine.Context.IsRenewal,
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
                                                                               Payments = deposits.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).SingleOrDefault(),
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

        private Models.Enrollment.ExpectedState ExpectedState(out IEnumerable<ValidationResult> supplementalValidation)
        {
            supplementalValidation = Enumerable.Empty<ValidationResult>();
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
                else 
                {
                    supplementalValidation = validation.PartialValidate(stateMachine.Context, ctx => ctx.Services.PartialValidate(s => s.SelectedOffers), ctx => ctx.Services.PartialValidate(s => s.Location))
                        .Where(val => !val.MemberNames.All(m => System.Text.RegularExpressions.Regex.IsMatch(m, @"SelectedOffers\[[0-9]+\]\.OfferOption"))).ToArray();
                    if (supplementalValidation.Any())
                    {
                        return Models.Enrollment.ExpectedState.PlanSelection;
                    }
                    else
                    {
                        return Models.Enrollment.ExpectedState.PlanSettings;
                    }
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
        public async Task<ClientData> ServiceInformation([FromBody]ServiceInformation value)
        {
            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.Services = (from location in value.Locations
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on location equals service.Location into services
                                             from service in services.DefaultIfEmpty()
                                             select new LocationServices
                                             {
                                                 Location = location,
                                                 SelectedOffers = service != null ? service.SelectedOffers : null
                                             }).ToArray();

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData(typeof(DomainModels.Enrollments.AccountInformationState));
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> SelectedOffers([FromBody]SelectedOffers value)
        {
            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location equals oldService.Location into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location equals oldService.Location into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));
            else
                await stateMachine.ContextUpdated();

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
        public async Task<ClientData> AccountInformation([FromBody]AccountInformation request)
        {
            MapCartToServices(request);

            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.ContactInfo = request.ContactInfo;
            if (stateMachine.Context.ContactInfo != null && stateMachine.Context.ContactInfo.Phone != null)
            {
                EnsureTypedPhones(stateMachine.Context.ContactInfo.Phone);
            }
            stateMachine.Context.DriversLicense = request.DriversLicense;
            stateMachine.Context.OnlineAccount = request.OnlineAccount;
            if (stateMachine.Context.OnlineAccount != null)
            {
                stateMachine.Context.OnlineAccount.Username = domain.AccountPrefix + stateMachine.Context.OnlineAccount.Username;
            }
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;

            await stateMachine.ContextUpdated();

            MapCartToServices(request);

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));
            else if (stateMachine.Context.IsRenewal && stateMachine.State == typeof(DomainModels.Enrollments.LoadDespositInfoState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));

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
        public async Task<ClientData> VerifyIdentity([FromBody]VerifyIdentity request)
        {
            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.SelectedIdentityAnswers = request.SelectedIdentityAnswers;

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.VerifyIdentityState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            return ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> ConfirmOrder([FromBody]ConfirmOrder request)
        {
            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;

            await stateMachine.ContextUpdated();

            await stateMachine.Process();

            return ClientData(null);
        }
    }
}