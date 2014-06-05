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

namespace StreamEnergy.MyStream.Controllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item translationItem;
        private readonly StateMachineSessionHelper<UserContext, InternalContext> stateHelper;
        private readonly IStateMachine<UserContext, InternalContext> stateMachine;

        public EnrollmentController(StateMachineSessionHelper<UserContext, InternalContext> stateHelper)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));

            stateHelper.Initialize(typeof(EnrollmentController));

            this.stateHelper = stateHelper;
            this.stateMachine = stateHelper.StateMachine;
        }

        protected override void Dispose(bool disposing)
        {
            stateHelper.Dispose();
            base.Dispose(disposing);
        }

        [HttpPost]
        public void Reset()
        {
            stateHelper.Reset();
        }

        /// <summary>
        /// Gets all the client data, such as for a page refresh
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        public ClientData ClientData()
        {
            return new ClientData
            {
                Validations = TranslatedValidationResult.Translate(stateMachine.ValidationResults, translationItem),
                BillingAddress = stateMachine.Context.BillingAddress,
                ContactInfo = stateMachine.Context.ContactInfo,
                DriversLicense = stateMachine.Context.DriversLicense,
                Language = stateMachine.Context.Language,
                SecondaryContactInfo = stateMachine.Context.SecondaryContactInfo,
                LocationServices = stateMachine.Context.Services,
                SelectedIdentityAnswers = null,
                Offers = stateMachine.InternalContext.AllOffers == null ? null :
                    (from entry in stateMachine.InternalContext.AllOffers
                     let addressId = LookupAddressId(entry.Item1)
                     where addressId != null
                     group entry.Item2 by addressId).ToDictionary(e => e.Key, e => (IEnumerable<IOffer>)e.ToArray()),
                OfferOptionRules = stateMachine.InternalContext.OfferOptionRulesByAddressOffer == null ? null :
                    (from entry in stateMachine.InternalContext.OfferOptionRulesByAddressOffer
                     let addressId = LookupAddressId(entry.Item1)
                     where addressId != null
                     group entry by addressId into byAddressId
                     let byOfferId = byAddressId.ToDictionary(e => e.Item2.Id, e => e.Item3)
                     select new { AddressId = byAddressId.Key, Value = byOfferId }).ToDictionary(e => e.AddressId, e => e.Value),
                IdentityQuestions = stateMachine.InternalContext.IdentityCheckResult != null ? stateMachine.InternalContext.IdentityCheckResult.IdentityQuestions : null,
                DepositAmount = stateMachine.InternalContext.Deposit != null ? stateMachine.InternalContext.Deposit.Amount : (decimal?)null,
                ConfirmationNumber = stateMachine.InternalContext.PlaceOrderResult != null ? stateMachine.InternalContext.PlaceOrderResult.ConfirmationNumber : null
            };
        }

        [HttpPost]
        public ClientData ServiceInformation([FromBody]ServiceInformation value)
        {
            // TODO - merge address ids
            stateMachine.Context.Services = (from location in value.Locations
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<KeyValuePair<string, LocationServices>>()) on location.Key equals service.Key into services
                                             from service in services.DefaultIfEmpty()
                                             select new
                                             {
                                                 Key = location.Key,
                                                 Value = new LocationServices
                                                     {
                                                         Location = location.Value.Location,
                                                         SelectedOffers = service.Value != null ? service.Value.SelectedOffers : null
                                                     }
                                             }).ToDictionary(e => e.Key, e => e.Value);

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        [HttpPost]
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
                                                  }).ToDictionary(o => o.Offer.Id);
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
        public ClientData AccountInformation([FromBody]AccountInformation request)
        {
            // TODO - merge address ids
            stateMachine.Context.Services = (from location in request.Locations
                                             join service in stateMachine.Context.Services on location.Key equals service.Key into services
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
                        stateMachine.Context.Services[addressId].SelectedOffers[offerId].OfferOption = request.OfferOptions[addressId][offerId];
                    }
                }
            }

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.VerifyIdentityState));

            return ClientData();
        }

        [HttpPost]
        public ClientData VerifyIdentity([FromBody]VerifyIdentity request)
        {
            stateMachine.Context.SelectedIdentityAnswers = request.SelectedIdentityAnswers;

            if (stateMachine.State == typeof(DomainModels.Enrollments.VerifyIdentityState))
                stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            return ClientData();
        }

        [HttpPost]
        public ClientData ConfirmOrder([FromBody]ConfirmOrder request)
        {
            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;

            stateMachine.Process();

            return ClientData();
        }
    }
}