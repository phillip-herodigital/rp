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
        private IStateMachine<UserContext, InternalContext> stateMachine;
        private readonly SessionHelper sessionHelper;

        internal class SessionHelper
        {
            private readonly HttpSessionStateBase session;
            private static readonly string ContextSessionKey = typeof(EnrollmentController).FullName + " " + typeof(UserContext).FullName;
            private static readonly string InternalContextSessionKey = typeof(EnrollmentController).FullName + " " + typeof(InternalContext).FullName;
            private static readonly string StateSessionKey = typeof(EnrollmentController).FullName + " State";

            public SessionHelper(HttpSessionStateBase session)
            {
                this.session = session;
            }

            public UserContext UserContext
            {
                get
                {
                    var context = session[ContextSessionKey] as UserContext;
                    if (context == null)
                        session[ContextSessionKey] = context = new UserContext();
                    return context;
                }
                set { session[ContextSessionKey] = value; }
            }

            public Type State
            {
                get
                {
                    return (session[StateSessionKey] as Type) ?? typeof(DomainModels.Enrollments.ServiceInformationState);
                }
                set { session[StateSessionKey] = value; }
            }

            public InternalContext InternalContext
            {
                get { return session[InternalContextSessionKey] as InternalContext; }
                set { session[InternalContextSessionKey] = value; }
            }
        }

        public EnrollmentController(HttpSessionStateBase session, StateMachine<UserContext, InternalContext> stateMachine)
            : this(new SessionHelper(session), stateMachine)
        {
        }

        internal EnrollmentController(SessionHelper sessionHelper, StateMachine<UserContext, InternalContext> stateMachine)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));
            this.stateMachine = stateMachine;
            this.sessionHelper = sessionHelper;

            var context = sessionHelper.UserContext;

            var state = sessionHelper.State;
            stateMachine.Initialize(state, context, sessionHelper.InternalContext);
        }

        protected override void Dispose(bool disposing)
        {
            if (stateMachine != null)
            {
                sessionHelper.UserContext = stateMachine.Context;
                sessionHelper.State = stateMachine.State;
                sessionHelper.InternalContext = stateMachine.InternalContext;
            }
            else
            {
                sessionHelper.UserContext = null;
                sessionHelper.State = null;
                sessionHelper.InternalContext = null;
            }

            base.Dispose(disposing);
        }

        [HttpPost]
        public void Reset()
        {
            stateMachine = null;
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
                Offers = (from offer in stateMachine.InternalContext.AllOffers
                             group offer.Item2 by LookupAddressId(offer.Item1)).ToDictionary(e => e.Key, e => (IEnumerable<IOffer>)e.ToArray()),
                OfferOptionRules = (from entry in stateMachine.InternalContext.OfferOptionRulesByAddressOffer
                                    group entry by LookupAddressId(entry.Item1) into byAddressId
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
                                             join service in stateMachine.Context.Services on location.Key equals service.Key into services
                                             from service in services.DefaultIfEmpty()
                                             select new
                                             {
                                                 Key = location.Key,
                                                 Value = new LocationServices
                                                     {
                                                         Location = location.Value,
                                                         SelectedOffers = service.Value.SelectedOffers
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
                                                  select new SelectedOffer
                                                  {
                                                      Offer = LookupOffer(addressId, offerId)
                                                  }).ToDictionary(o => o.Offer.Id);
                }
            }

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        private string LookupAddressId(Location serviceLocation)
        {
            return stateMachine.Context.Services.Where(s => s.Value.Location.Address.Equals(serviceLocation.Address)).Select(s => s.Key).FirstOrDefault() ?? ("_" + serviceLocation.Address.GetHashCode().ToString());
        }

        private IOffer LookupOffer(string addressId, string offerId)
        {
            return stateMachine.InternalContext.AllOffers.FirstOrDefault(offer => LookupAddressId(offer.Item1) == addressId && offer.Item2.Id == offerId).Item2;
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
                                                     SelectedOffers = service.Value.SelectedOffers
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
        public ClientData PaymentInfo([FromBody]DomainModels.Payments.IPaymentInfo request)
        {
            stateMachine.Context.PaymentInfo = request;

            if (stateMachine.State == typeof(DomainModels.Enrollments.PaymentInfoState))
                stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            return ClientData();
        }

        [HttpPost]
        public ClientData ConfirmOrder([FromBody]ConfirmOrder request)
        {
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;

            stateMachine.Process();

            return ClientData();
        }
    }
}