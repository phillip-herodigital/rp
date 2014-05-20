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
                UserContext = CopyForClientDisplay(stateMachine.Context),
                Offers = stateMachine.InternalContext.AllOffers,
                OfferOptionRules = stateMachine.InternalContext.OfferOptionRules,
                IdentityQuestions = stateMachine.InternalContext.IdentityCheckResult != null ? stateMachine.InternalContext.IdentityCheckResult.IdentityQuestions : null,
                DepositAmount = stateMachine.InternalContext.Deposit != null ? stateMachine.InternalContext.Deposit.Amount : (decimal?)null,
                // TODO - more data, such as calendar, etc. - probably from stateMachine.InternalContext
            };
        }

        [HttpPost]
        public ClientData ServiceInformation([FromBody]ServiceInformation value)
        {
            stateMachine.Context.ServiceAddress = value.ServiceAddress;
            stateMachine.Context.ServiceCapabilities = value.ServiceCapabilities;
            
            // TODO - make sure this gets put in all the other service capabilities, or remove it from the interface and have the front-end do it
            foreach (var entry in value.ServiceCapabilities.OfType<TexasServiceCapability>())
            {
                entry.IsNewService = value.IsNewService;
            }

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        [HttpPost]
        public ClientData SelectedOffers([FromBody]SelectedOffers value)
        {
            stateMachine.Context.SelectedOffers = (from offerId in value.OfferIds
                                                   let offer = stateMachine.InternalContext.AllOffers.SingleOrDefault(o => o.Id == offerId)
                                                   where offer != null
                                                   select new SelectedOffer
                                                   {
                                                       Offer = offer,
                                                   }).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            return ClientData();
        }

        private UserContext CopyForClientDisplay(UserContext userContext)
        {
            return new UserContext
            {
                BillingAddress = userContext.BillingAddress,
                ContactInfo = userContext.ContactInfo,
                DriversLicense = userContext.DriversLicense,
                Language = userContext.Language,
                SecondaryContactInfo = userContext.SecondaryContactInfo,
                SelectedOffers = userContext.SelectedOffers,
                ServiceAddress = userContext.ServiceAddress,
                ServiceCapabilities = userContext.ServiceCapabilities,
                SocialSecurityNumber = null,

                // TODO - there will be more properties here
            };
        }

        [HttpPost]
        public ClientData AccountInformation([FromBody]AccountInformation request)
        {
            stateMachine.Context.ServiceAddress = request.ServiceAddress;
            stateMachine.Context.ServiceCapabilities = request.ServiceCapabilities;
            stateMachine.Context.ContactInfo = request.ContactInfo;
            stateMachine.Context.BillingAddress = request.BillingAddress;
            stateMachine.Context.DriversLicense = request.DriversLicense;
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;
            if (request.OfferOptions != null)
            {
                foreach (var entry in request.OfferOptions)
                {
                    var selectedOffer = stateMachine.Context.SelectedOffers.SingleOrDefault(offer => offer.Offer.Id == entry.Key);
                    if (selectedOffer == null)
                    {
                        selectedOffer = new SelectedOffer { Offer = stateMachine.InternalContext.AllOffers.SingleOrDefault(offer => offer.Id == entry.Key) };
                        if (selectedOffer.Offer == null)
                            continue;
                        stateMachine.Context.SelectedOffers = stateMachine.Context.SelectedOffers.Concat(Enumerable.Repeat(selectedOffer, 1));
                    }
                    selectedOffer.OfferOption = entry.Value;
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
    }
}