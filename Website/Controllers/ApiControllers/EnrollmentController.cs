using System;
using System.Collections.Generic;
using System.Collections.Specialized;
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
using ResponsivePath.Logging;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Documents;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class EnrollmentController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item translationItem;
        private readonly SessionHelper stateHelper;
        private IStateMachine<UserContext, InternalContext> stateMachine;
        private readonly IValidationService validation;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly StackExchange.Redis.IDatabase redisDatabase;
        private readonly IEnrollmentService enrollmentService;
        //private readonly IDocumentStore documentStore;

        public class SessionHelper : StateMachineSessionHelper<UserContext, InternalContext>
        {
            private static readonly Type defaultState = typeof(DomainModels.Enrollments.ServiceInformationState);
            public SessionHelper(HttpSessionStateBase session, IUnityContainer container)
                : base(session, container, typeof(EnrollmentController), defaultState, storeInternal: true)
            {
            }

            public bool IsDefault
            {
                get { return State == defaultState; }
            }
        }

        public EnrollmentController(SessionHelper stateHelper, IValidationService validation, StackExchange.Redis.IDatabase redisDatabase, IEnrollmentService enrollmentService)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{5B9C5629-3350-4D85-AACB-277835B6B1C9}"));

            this.domain = Sitecore.Context.Site.Domain;
            this.stateHelper = stateHelper;
            this.validation = validation;
            this.redisDatabase = redisDatabase;
            this.enrollmentService = enrollmentService;
            //this.documentStore = documentStore;
        }

        public async Task Initialize(NameValueCollection enrollmentDpiParameters = null)
        {
            await stateHelper.EnsureInitialized().ConfigureAwait(false);
            if (enrollmentDpiParameters != null)
            {
                if (!stateHelper.IsDefault && enrollmentDpiParameters["renewal"] != "true")
                {
                    stateHelper.Reset();
                    await stateHelper.EnsureInitialized().ConfigureAwait(false);
                }
                stateHelper.StateMachine.InternalContext.EnrollmentDpiParameters = enrollmentDpiParameters;
            }
            this.stateMachine = stateHelper.StateMachine;
        }

        protected override void Dispose(bool disposing)
        {
            stateHelper.Dispose();
            base.Dispose(disposing);
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<VerifyEsnResponseCode> ValidateEsn([FromBody]string esn)
        {
            return await enrollmentService.IsEsnValid(esn);
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public void Reset()
        {
            stateHelper.Reset();
        }

        [NonAction]
        public async Task<bool> SetupRenewal(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount)
        {
            stateHelper.Reset();
            await stateHelper.EnsureInitialized();

            stateHelper.StateMachine.InternalContext.GlobalCustomerId = account.StreamConnectCustomerId;
            stateHelper.State = typeof(ServiceInformationState);
            stateHelper.Context.IsRenewal = true;
            stateHelper.Context.ContactInfo = account.Details.ContactInfo;
            stateHelper.Context.MailingAddress = account.Details.BillingAddress;
            stateHelper.Context.Services = new LocationServices[]
            {
                new LocationServices 
                { 
                    Location = new Location 
                    { 
                        Address = subAccount.ServiceAddress,
                        Capabilities = subAccount.Capabilities.OfType<RenewalAccountCapability>().Single().Capabilities
                    }
                }
            };
            await stateHelper.StateMachine.Process();

            return true;
        }

        /// <summary>
        /// Gets all the client data, such as for a page refresh
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public ClientData ClientData(params Type[] currentFinalStates)
        {
            var services = stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>();
            var offers = stateMachine.InternalContext.AllOffers ?? new Dictionary<Location, LocationOfferSet>();
            var optionRules = stateMachine.InternalContext.OfferOptionRules ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<IOfferOptionRules>>();
            var deposits = stateMachine.InternalContext.Deposit ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>>();
            var confirmations = stateMachine.InternalContext.PlaceOrderResult ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>>();
            var renewalConfirmations = (stateMachine.InternalContext.RenewalResult != null ? stateMachine.InternalContext.RenewalResult.Data : null) ?? new RenewalResult();
            var standardValidation = (currentFinalStates.Contains(stateMachine.State) ? Enumerable.Empty<ValidationResult>() : stateMachine.ValidationResults);
            IEnumerable<ValidationResult> supplementalValidation;
            var expectedState = ExpectedState(out supplementalValidation);
            var validations = TranslatedValidationResult.Translate(from val in standardValidation.Union(supplementalValidation)
                                                                   group val by val.ErrorMessage + ";" + string.Join(",", val.MemberNames) into val
                                                                   select val.First(), translationItem);

            bool isLoading = stateMachine.IsBreakForced();

            return new ClientData
            {
                IsTimeout = stateHelper.IsNewSession,
                IsLoading = isLoading,
                Validations = validations,
                ExpectedState = expectedState,
                IsRenewal = stateMachine.Context.IsRenewal,
                ContactInfo = stateMachine.Context.ContactInfo,
                Language = stateMachine.Context.Language,
                SecondaryContactInfo = stateMachine.Context.SecondaryContactInfo,
                MailingAddress = stateMachine.Context.MailingAddress,
                PreviousAddress = stateMachine.Context.PreviousAddress,
                PreviousProvider = stateMachine.Context.PreviousProvider,
                Cart = from service in services
                       let locationOfferSet = offers.ContainsKey(service.Location) ? offers[service.Location] : new LocationOfferSet()
                       select new CartEntry
                       {
                           Location = service.Location,
                           Eligibility = stateMachine.InternalContext.LocationVerifications.ContainsKey(service.Location) ? stateMachine.InternalContext.LocationVerifications[service.Location] : PremiseVerificationResult.Success,
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
                                                                               Payments = deposits.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details).FirstOrDefault(),
                                                                               ConfirmationSuccess = confirmations.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id)
                                                                                    .Where(entry =>
                                                                                    {
                                                                                        var paymentConfirmation = entry.Details.PaymentConfirmation;
                                                                                        return paymentConfirmation == null || !string.IsNullOrEmpty(paymentConfirmation.ConfirmationNumber);
                                                                                    })
                                                                                    .Select(entry => entry.Details.IsSuccess).FirstOrDefault()
                                                                                    || renewalConfirmations.IsSuccess,
                                                                               ConfirmationNumber = confirmations.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details.ConfirmationNumber).FirstOrDefault()
                                                                                    ?? renewalConfirmations.ConfirmationNumber
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
                IdentityQuestions = (stateMachine.InternalContext.IdentityCheck != null && stateMachine.InternalContext.IdentityCheck.IsCompleted) ? stateMachine.InternalContext.IdentityCheck.Data.IdentityQuestions : null,
            };
        }

        private Models.Enrollment.ExpectedState ExpectedState(out IEnumerable<ValidationResult> supplementalValidation)
        {
            if (stateMachine.State == typeof(IdentityCheckHardStopState))
            {
                supplementalValidation = Enumerable.Empty<ValidationResult>();
                return Models.Enrollment.ExpectedState.IdentityCheckHardStop;
            }
            else if (stateMachine.State == typeof(EnrollmentErrorState))
            {
                supplementalValidation = Enumerable.Empty<ValidationResult>();
                return Models.Enrollment.ExpectedState.ErrorHardStop;
            }
            supplementalValidation = Enumerable.Empty<ValidationResult>();
            var validationResults = stateMachine.ValidationResults;
            var members = validationResults.SelectMany(result => result.MemberNames);

            if (members.Any(m => m.StartsWith("AgreeToTerms")) || members.Any(m => m.StartsWith("PaymentInfo")))
            {
                return Models.Enrollment.ExpectedState.ReviewOrder;
            }
            else if (members.Any(m => m.StartsWith("SelectedIdentityAnswers")) || stateMachine.State == typeof(SubmitIdentityState))
            {
                return Models.Enrollment.ExpectedState.VerifyIdentity;
            }
            else if (members.Any(m => m.StartsWith("Services")))
            {
                if (stateMachine.Context.Services == null || 
                    stateMachine.Context.Services.Length == 0 || 
                    validation.PartialValidate(stateMachine.Context, ctx => ctx.Services.PartialValidate(s => s.Location.Address.PostalCode5, s => s.Location.Capabilities)).Any() ||
                    stateMachine.InternalContext.AllOffers.Where(o => stateMachine.Context.Services.Any(s => s.Location == o.Key)).Any(o => !o.Value.Offers.Any() && !o.Value.OfferSetErrors.Any()))
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
            await Initialize();
            await ResetPreAccountInformation();
            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.Services = (from location in value.Locations
                                             join service in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on location equals service.Location into services
                                             from service in services.DefaultIfEmpty()
                                             select new LocationServices
                                             {
                                                 Location = service != null ? service.Location : location,
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
            await Initialize();
            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location.Address equals oldService.Location.Address into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();
            await ResetPreAccountInformation();

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.ServiceInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));

            stateMachine.Context.Services = (from newSelection in value.Selection
                                             join oldService in (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()) on newSelection.Location.Address equals oldService.Location.Address into oldServices
                                             select Combine(newSelection, oldServices.SingleOrDefault(), stateMachine.InternalContext.AllOffers)).ToArray();

            if (stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.AccountInformationState));
            else
                await stateMachine.ContextUpdated();

            return ClientData(typeof(DomainModels.Enrollments.AccountInformationState));
        }

        private async Task ResetPreAccountInformation()
        {
            if (stateHelper.Context.IsRenewal)
                return;
            if (stateHelper.InternalContext != null)
            {
                stateHelper.InternalContext.IdentityCheck = null;
                stateHelper.InternalContext.CreditCheck = null;
                stateHelper.InternalContext.Deposit = null;
            }
            if (stateHelper.State != typeof(DomainModels.Enrollments.ServiceInformationState) && stateHelper.State != typeof(DomainModels.Enrollments.PlanSelectionState)
                && stateHelper.State != typeof(DomainModels.Enrollments.AccountInformationState))
            {
                var context = stateHelper.Context;
                var internalContext = stateHelper.InternalContext;
                context.SelectedIdentityAnswers = null;
                stateHelper.Reset();
                stateHelper.Context = context;
                stateHelper.InternalContext = internalContext;
                stateHelper.State = typeof(DomainModels.Enrollments.AccountInformationState);

                await stateHelper.EnsureInitialized();
            }
            this.stateMachine = stateHelper.StateMachine;
        }

        private LocationServices Combine(SelectedOfferSet newSelection, LocationServices oldService, Dictionary<Location, LocationOfferSet> allOffers)
        {
            allOffers = allOffers ?? new Dictionary<Location, LocationOfferSet>();
            var result = oldService ?? new LocationServices();
            IEnumerable<IOffer> locationOffers;
            if (stateHelper.Context.IsRenewal)
            {
                locationOffers = allOffers.ContainsKey(oldService.Location) ? allOffers[oldService.Location].Offers : Enumerable.Empty<IOffer>();
                result.Location = oldService.Location;
            }
            else
            {
                locationOffers = allOffers.ContainsKey(newSelection.Location) ? allOffers[newSelection.Location].Offers : Enumerable.Empty<IOffer>();
                result.Location = newSelection.Location;
            }
            
            result.SelectedOffers = (from entry in newSelection.OfferIds
                                     join oldSelection in result.SelectedOffers ?? Enumerable.Empty<SelectedOffer>() on entry equals oldSelection.Offer.Id into oldSelections
                                     let offer = locationOffers.Where(offer => offer.Id == entry).FirstOrDefault()
                                     where offer != null
                                     select oldSelections.FirstOrDefault() ??
                                        new SelectedOffer
                                        {
                                            Offer = offer
                                        }).ToArray();
            return result;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> AccountInformation([FromBody]AccountInformation request)
        {
            await Initialize();
            if (stateMachine.InternalContext.EnrollmentSaveState != null && stateMachine.InternalContext.EnrollmentSaveState.IsCompleted)
            {
                await ResetPreAccountInformation();
            }

            MapCartToServices(request);

            stateMachine.Context.AgreeToTerms = false;
            stateMachine.Context.ContactInfo = request.ContactInfo;
            stateMachine.Context.ContactTitle = request.ContactTitle;
            if (stateMachine.Context.ContactInfo != null && stateMachine.Context.ContactInfo.Phone != null)
            {
                EnsureTypedPhones(stateMachine.Context.ContactInfo.Phone);
            }
            stateMachine.Context.OnlineAccount = request.OnlineAccount;
            if (stateMachine.Context.OnlineAccount != null)
            {
                stateMachine.Context.OnlineAccount.Username = domain.AccountPrefix + stateMachine.Context.OnlineAccount.Username;
            }
            stateMachine.Context.Language = request.Language;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;
            stateMachine.Context.PreviousAddress = request.PreviousAddress;
            stateMachine.Context.MailingAddress = request.MailingAddress;

            stateMachine.Context.TaxId = request.TaxId;
            stateMachine.Context.CompanyName = request.CompanyName;
            stateMachine.Context.DoingBusinessAs = request.DoingBusinessAs;
            stateMachine.Context.PreferredSalesExecutive = request.PreferredSalesExecutive;
            stateMachine.Context.PreviousProvider = request.PreviousProvider;

            await stateMachine.ContextUpdated();

            MapCartToServices(request);

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));
            else if (stateMachine.Context.IsRenewal && stateMachine.State == typeof(DomainModels.Enrollments.LoadDespositInfoState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));

            return ClientData(typeof(DomainModels.Enrollments.VerifyIdentityState), typeof(DomainModels.Enrollments.PaymentInfoState));
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
                                             let oldService = (stateMachine.Context.Services ?? Enumerable.Empty<LocationServices>()).FirstOrDefault(l => l.Location.Address == cartEntry.Location.Address)
                                             let location = (oldService != null) ? oldService.Location : cartEntry.Location
                                             let locationOffers = allOffers.ContainsKey(location) ? allOffers[location].Offers : Enumerable.Empty<IOffer>()
                                             select new LocationServices
                                             {
                                                 Location = location,
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
        public async Task<ClientData> Resume()
        {
            await Initialize();
            await stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));

            var resultData = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
            await GenerateEndOfEnrollmentScreenshot(resultData);
            return resultData;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> VerifyIdentity([FromBody]VerifyIdentity request)
        {
            await Initialize();
            
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
            await Initialize();
            
            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            if (stateMachine.Context.PaymentInfo is DomainModels.Payments.TokenizedCard)
            {
                ((DomainModels.Payments.TokenizedCard)stateMachine.Context.PaymentInfo).Name = stateMachine.Context.ContactInfo.Name.First + " " + stateMachine.Context.ContactInfo.Name.Last;
            }
            stateMachine.Context.AdditionalAuthorizations = request.AdditionalAuthorizations ?? new Dictionary<AdditionalAuthorization, bool>();
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;
            stateMachine.Context.W9BusinessData = request.W9BusinessData;
            foreach (var locationService in stateMachine.Context.Services)
            {
                foreach (var offer in locationService.SelectedOffers)
                {
                    offer.WaiveDeposit = false;
                }
            }
            foreach (var depositWaiver in request.DepositWaivers ?? Enumerable.Empty<DepositWaiver>())
            {
                var locationService = stateMachine.Context.Services.FirstOrDefault(svc => svc.Location == depositWaiver.Location);
                if (locationService != null)
                {
                    var target = locationService.SelectedOffers.FirstOrDefault(sel => sel.Offer.Id == depositWaiver.OfferId);
                    target.WaiveDeposit = true;
                }
            }

            await stateMachine.ContextUpdated();

            await stateMachine.Process();

            var resultData = ClientData();

            await GenerateEndOfEnrollmentScreenshot(resultData);

            return ClientData();
        }

        private async Task GenerateEndOfEnrollmentScreenshot(Models.Enrollment.ClientData resultData)
        {
            if (redisDatabase != null && resultData.ExpectedState == Models.Enrollment.ExpectedState.OrderConfirmed)
            {
                await redisDatabase.ListRightPushAsync("EnrollmentScreenshots", StreamEnergy.Json.Stringify(resultData));
            }
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<HttpResponseMessage> Download(string documentType)
        {
            await Initialize();
            return null;
            //return await documentStore.DownloadByCustomerAsMessage(stateMachine.InternalContext.GlobalCustomerId, documentType);
        }

    }
}