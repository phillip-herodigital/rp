﻿using StreamEnergy.DomainModels;
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

namespace StreamEnergy.MyStream.Controllers.ApiControllers
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
            var services = stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>();
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
                Cart = from service in services
                       select new CartEntry
                       {
                           Location = service.Location,
                           OfferInformationByType = (from selection in service.SelectedOffers ?? Enumerable.Empty<SelectedOffer>()
                                                     where selection.Offer != null
                                                     select selection.Offer.OfferType).Union(
                                                     from offer in offers
                                                     select offer.Item2.OfferType)
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
                                                         AvailableOffers = (from entry in offers
                                                                            where entry.Item1 == service.Location && entry.Item2.OfferType == offerType
                                                                            select entry.Item2)
                                                     })
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
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on location equals service.Location into services
                                             from service in services.DefaultIfEmpty()
                                             select new LocationServices
                                             {
                                                 Location = location,
                                                 SelectedOffers = service != null ? service.SelectedOffers : null
                                             }).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData SelectedOffers([FromBody]SelectedOffers value)
        {
            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                return ClientData();

            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location equals oldService.Location into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        private LocationServices Combine(SelectedOfferSet newSelection, LocationServices oldService, IEnumerable<Tuple<Location, IOffer>> allOffers)
        {
            var result = oldService ?? new LocationServices();
            result.Location = newSelection.Location;
            result.SelectedOffers = (from entry in newSelection.OfferIds
                                     join oldSelection in result.SelectedOffers ?? Enumerable.Empty<SelectedOffer>() on entry equals oldSelection.Offer.Id into oldSelections
                                     let offer = allOffers.Where(offer => offer.Item1 == newSelection.Location && offer.Item2.Id == entry).Select(o => o.Item2).FirstOrDefault()
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
            stateMachine.Context.BillingAddress = request.BillingAddress;
            stateMachine.Context.DriversLicense = request.DriversLicense;
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.VerifyIdentityState));

            MapCartToServices(request);

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.VerifyIdentityState));

            return ClientData();
        }

        private void MapCartToServices(AccountInformation request)
        {
            stateMachine.Context.Services = (from cartEntry in request.Cart
                                             select new LocationServices
                                             {
                                                 Location = cartEntry.Location,
                                                 SelectedOffers = (from type in cartEntry.OfferInformationByType
                                                                   from offerInfo in type.Value.OfferSelections
                                                                   let offer = stateMachine.InternalContext.AllOffers.Where(offer => offer.Item1 == cartEntry.Location && offer.Item2.Id == offerInfo.OfferId).Select(o => o.Item2).FirstOrDefault()
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