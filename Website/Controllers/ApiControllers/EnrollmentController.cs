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
using StreamEnergy.DomainModels.Enrollments.Service;
using StreamEnergy.Extensions;
using ResponsivePath.Logging;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Enrollment;
using StreamEnergy.Processes;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.DomainModels.Documents;
using StreamEnergy.DomainModels.Activation;
using StreamEnergy.Services.Helpers;
using StreamEnergy.DomainModels.Associate;
using StreamEnergy.Interpreters;
using System.IO;
using System.Net.Http.Headers;
using Sitecore.Data.Items;
using StreamEnergy.DomainModels.Emails;
using StreamEnergy.MyStream.Models.MobileEnrollment;
using System.Data.SqlClient;

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
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly ICurrentUser currentUser;
        private readonly IActivationCodeLookup activationCodeLookup;
        private readonly IAssociateLookup associateLookup;
        private readonly IDpiEnrollmentParameters dpiEnrollmentParameters;
        private readonly IEmailService emailService;
        private readonly ISettings settings;
        private readonly ILogger logger;
        private const string redisPrefix = "AttemptCount_";
        private readonly HttpClient httpClient;
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

        public EnrollmentController(SessionHelper stateHelper, IValidationService validation, StackExchange.Redis.IDatabase redisDatabase, IEnrollmentService enrollmentService, DomainModels.Accounts.IAccountService accountService, ICurrentUser currentUser, IActivationCodeLookup activationCodeLookup, IAssociateLookup associateLookup, IDpiEnrollmentParameters dpiEnrollmentParameters, IEmailService emailService, ISettings settings, ILogger logger, HttpClient httpClient)
        {
            this.translationItem = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{67561BCF-4966-4FB3-8309-40ADFB69B3AE}"));

            this.domain = Sitecore.Context.Site.Domain;
            this.stateHelper = stateHelper;
            this.validation = validation;
            this.redisDatabase = redisDatabase;
            this.enrollmentService = enrollmentService;
            this.accountService = accountService;
            this.currentUser = currentUser;
            this.activationCodeLookup = activationCodeLookup;
            //this.documentStore = documentStore;
            this.associateLookup = associateLookup;
            this.dpiEnrollmentParameters = dpiEnrollmentParameters;
            this.emailService = emailService;
            this.settings = settings;
            this.logger = logger;
            this.httpClient = httpClient;
        }

        public async Task Initialize()
        {
            await stateHelper.EnsureInitialized().ConfigureAwait(false);

            bool useRemoteEnrollment;
            NameValueCollection enrollmentDpiParameters = null;
            int Percentage = 0;
            EnrollmentTrafficCopHelper.HandlePersistence(out useRemoteEnrollment, out enrollmentDpiParameters, Percentage);
            if (stateHelper.StateMachine.InternalContext.EnrollmentDpiParameters == null)
            {
                if (enrollmentDpiParameters != null)
                {
                    if (!stateHelper.IsDefault && enrollmentDpiParameters["renewal"] != "true" && !stateHelper.StateMachine.Context.IsAddLine)
                    {
                        stateHelper.Reset();
                        await stateHelper.EnsureInitialized().ConfigureAwait(false);
                    }
                    stateHelper.StateMachine.InternalContext.EnrollmentDpiParameters = enrollmentDpiParameters;
                }
            }
            dpiEnrollmentParameters.Initialize(enrollmentDpiParameters);

            if (dpiEnrollmentParameters.RefSite.ToUpper() == "FER")
            {
                stateHelper.StateMachine.InternalContext.AssociateInformation = associateLookup.LookupAssociateByGroupId(dpiEnrollmentParameters.GroupId);
            }
            else if (stateHelper.StateMachine.InternalContext.AssociateInformation == null || stateHelper.StateMachine.InternalContext.AssociateInformation.AssociateId != dpiEnrollmentParameters.AccountNumber)
            {
                stateHelper.StateMachine.InternalContext.AssociateInformation = associateLookup.LookupAssociate(dpiEnrollmentParameters.AccountNumber);
            }

            stateHelper.StateMachine.InternalContext.AssociateEmailSent = false;

            stateHelper.StateMachine.InternalContext.EnrollmentScreenshotTaken = false;

            stateHelper.StateMachine.Context.SitecoreLanguageIsoCode = Sitecore.Context.Language.CultureInfo.TwoLetterISOLanguageName;

            this.stateMachine = stateHelper.StateMachine;
        }

        protected override void Dispose(bool disposing)
        {
            stateHelper.Dispose();
            base.Dispose(disposing);
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<VerifyEsnResponse> ValidateEsn([FromBody]string esn)
        {
            return await enrollmentService.IsEsnValid(esn);
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<VerifyImeiResponse> VerifyImei([FromBody]VerifyDeviceNumberRequest request)
        {
            string imei = request.Imei;
            string ipAddress = HttpContext.Current.Request.UserHostAddress;
            bool captchaEnabled = string.IsNullOrEmpty(settings.GetSettingsValue("Mobile Enrollment Options", "Disable Max ESN Check"));
            int maxLookups = int.Parse(settings.GetSettingsValue("Mobile Enrollment Options", "Max ESN Checks Per Hour"));
            string privateKey = settings.GetSettingsValue("Mobile Enrollment Options", "reCaptcha Private Key");

            if (captchaEnabled)
            {
                var lookupCount = (int?)await redisDatabase.StringGetAsync(redisPrefix + ipAddress);
                if (lookupCount != null && lookupCount > maxLookups)
                {
                    // make sure the reCaptcha input is valid
                    var googleReply = await httpClient.PostAsync(string.Format("https://www.google.com/recaptcha/api/siteverify?secret={0}&response={1}", privateKey, request.Captcha), null);
                    var captchaResponse = Newtonsoft.Json.JsonConvert.DeserializeObject<CaptchaResponse>(googleReply.Content.ReadAsStringAsync().Result);
                    if (!captchaResponse.Success)
                    {
                        await redisDatabase.StringIncrementAsync(redisPrefix + ipAddress);
                        await redisDatabase.KeyExpireAsync(redisPrefix + ipAddress, TimeSpan.FromMinutes(60));
                        return new VerifyImeiResponse
                        {
                            IsValidImei = false,
                            VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.ReCaptchaError,
                        };
                    }
                }
                if (lookupCount == null)
                {
                    await redisDatabase.KeyExpireAsync(redisPrefix + ipAddress, TimeSpan.FromMinutes(60));
                }
                await redisDatabase.StringIncrementAsync(redisPrefix + ipAddress);
                await redisDatabase.KeyExpireAsync(redisPrefix + ipAddress, TimeSpan.FromMinutes(60));
            }

            if (!string.IsNullOrEmpty(settings.GetSettingsValue("Mobile Enrollment Options", "Allow Fake IMEI Numbers")))
            {
                if (imei == "111")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.ATT,
                        Manufacturer = "Samsung"
                    };
                }
                if (imei == "222")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.ATT,
                        Manufacturer = "Apple Inc"
                    };
                }
                if (imei == "333")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint,
                        Manufacturer = "Samsung",
                        DeviceType = "U",
                    };
                }
                if (imei == "444")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint,
                        Manufacturer = "Apple",
                        DeviceType = "U",
                    };
                }
                if (imei == "555")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint,
                        Manufacturer = "Apple",
                        ICCID = "1234567890",
                        DeviceType = "U",
                    };
                }
                if (imei == "666")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.Success,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint,
                        Manufacturer = "Samsung",
                        DeviceType = "E",
                    };
                }
                if (imei == "777")
                {
                    return new VerifyImeiResponse
                    {
                        IsValidImei = true,
                        VerifyEsnResponseCode = DomainModels.Enrollments.VerifyEsnResponseCode.SuccessForeignDevice,
                        Provider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint,
                        Manufacturer = "Samsung",
                        DeviceType = "U",
                    };
                }
            }
            
            return await enrollmentService.VerifyImei(imei);
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<string> ValidateActivationCode([FromBody]string activationCode)
        {
            return await activationCodeLookup.LookupEsn(activationCode);
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<bool> ShowCaptcha()
        {
            // show Captcha after max tries exceeded
            bool showCaptcha = false;
            string ipAddress = HttpContext.Current.Request.UserHostAddress;
            bool captchaEnabled = string.IsNullOrEmpty(settings.GetSettingsValue("Mobile Enrollment Options", "Disable Max ESN Check"));
            int maxLookups = int.Parse(settings.GetSettingsValue("Mobile Enrollment Options", "Max ESN Checks Per Hour"));

            if (captchaEnabled)
            {
                var lookupCount = (int?)await redisDatabase.StringGetAsync(redisPrefix + ipAddress);
                showCaptcha = (lookupCount != null && lookupCount > maxLookups);
            }

            return showCaptcha;
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public void Reset()
        {
            stateHelper.Reset();
        }

        [NonAction]
        public async Task<ClientData> SetupRenewal(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount, string last4ssn)
        {
            stateHelper.StateMachine.InternalContext.GlobalCustomerId = account.StreamConnectCustomerId;
            stateHelper.State = typeof(PlanSelectionState);
            stateHelper.Context.IsRenewal = true;
            stateHelper.Context.ContactInfo = account.Details.ContactInfo;
            stateHelper.Context.MailingAddress = account.Details.BillingAddress;
            stateHelper.Context.RenewalESIID = account.Details.BillingAddress.StateAbbreviation == "TX" ? subAccount.Id : null;
            stateHelper.Context.SocialSecurityNumber = string.IsNullOrEmpty(stateMachine.Context.SocialSecurityNumber) ? string.Concat("00000", last4ssn) : stateMachine.Context.SocialSecurityNumber;

            string providerID = null;
            if (subAccount is NewJerseyElectricityAccount)
                providerID = ((NewJerseyElectricityAccount)subAccount).ProviderId;
            else if (subAccount is NewYorkElectricityAccount)
                providerID = ((NewYorkElectricityAccount)subAccount).ProviderId;
            else if (subAccount is NewJerseyGasAccount)
                providerID = ((NewJerseyGasAccount)subAccount).ProviderId;
            else if (subAccount is NewYorkGasAccount)
                providerID = ((NewYorkGasAccount)subAccount).ProviderId;
            else if (subAccount is PennsylvaniaElectricityAccount)
                providerID = ((PennsylvaniaElectricityAccount)subAccount).ProviderId;
            else if (subAccount is PennsylvaniaGasAccount)
                providerID = ((PennsylvaniaGasAccount)subAccount).ProviderId;
            else if (subAccount is DCElectricityAccount)
                providerID = ((DCElectricityAccount)subAccount).ProviderId;
            else if (subAccount is MarylandElectricityAccount)
                providerID = ((MarylandElectricityAccount)subAccount).ProviderId;
            else if (subAccount is MarylandGasAccount)
                providerID = ((MarylandGasAccount)subAccount).ProviderId;

            stateHelper.Context.RenewalProviderID = providerID;
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
            await stateHelper.StateMachine.ContextUpdated();
            this.stateMachine = stateHelper.StateMachine;

            return ClientData(typeof(DomainModels.Enrollments.PlanSelectionState));
        }

        [NonAction]
        public async Task<ClientData> SetupAddLine(DomainModels.Accounts.Account account)
        {
            stateHelper.Reset();
            await stateHelper.EnsureInitialized().ConfigureAwait(false);
            //stateHelper.StateMachine.InternalContext.GlobalCustomerId = account.StreamConnectCustomerId;
            stateHelper.State = typeof(ServiceInformationState);
            stateHelper.Context.IsAddLine = true;
            stateHelper.Context.AddLineAutoPay = account.AutoPay.IsEnabled;
            stateHelper.Context.ContactInfo = account.Details.ContactInfo;
            stateHelper.Context.AddLineAccountNumber = account.AccountNumber;
            stateHelper.Context.AddLineSubAccounts = account.SubAccounts;
            stateHelper.Context.MailingAddress = account.Details.BillingAddress;
            stateHelper.Context.PreviousAddress = account.Details.BillingAddress;
            
            if (stateMachine.Context.ContactInfo != null && stateMachine.Context.ContactInfo.Phone != null)
            {
                EnsureTypedPhones(stateMachine.Context.ContactInfo.Phone);
            }

            await stateHelper.StateMachine.Process();
            await stateHelper.StateMachine.ContextUpdated();
            this.stateMachine = stateHelper.StateMachine;

            return ClientData(typeof(DomainModels.Enrollments.ServiceInformationState));
        }

        [HttpGet]
        public dynamic GetPreviousProviders([FromUri] string optionRulesType)
        {
            Item item;
            switch (optionRulesType)
            {
                case "TexasElectricity":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/TX");
                    break;
                case "GeorgiaGasSwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/GA");
                    break;
                case "NewJerseyElectricitySwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/NJ/Electricity");
                    break;
                case "NewJerseyGasSwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/NJ/Gas");
                    break;
                case "NewYorkElectricitySwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/NY/Electricity");
                    break;
                case "NewYorkGasSwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/NY/Gas");
                    break;
                case "DCElectricitySwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/DC");
                    break;
                case "MarylandElectricitySwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/MD/Electricity");
                    break;
                case "MarylandGasSwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/MD/Gas");
                    break;
                case "PennsylvaniaElectricitySwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/PA/Electricity");
                    break;
                case "PennsylvaniaGasSwitch":
                    item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Previous Providers/PA/Gas");
                    break;
                default:
                    return null;
            }
            return item.Children.Select(child => new {
                Name = child.Fields["Name"].Value,
                Display = child.Fields["Display Text"].Value,
                FieldName = child.Fields["Field Name"].Value,
                Format = child.Fields["Valid Format"].Value,
                Example = child.Fields["Example"].Value,
                RegEx = child.Fields["Account Number RegEx"].Value
            });
        }

        /// <summary>
        /// Gets all the client data for a previous customer for single-page enrollments
        /// </summary>
        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> PreviousClientData([FromBody]SinglePage request)
        {
            string esiId = request.ServiceLocation.Capabilities.OfType<DomainModels.Enrollments.TexasElectricity.ServiceCapability>().Single().EsiId;
            string tdu = request.ServiceLocation.Capabilities.OfType<DomainModels.Enrollments.TexasElectricity.ServiceCapability>().Single().Tdu;
            // make an external service call to get the data
            await Initialize();

            // lookup the customer info in the internal DB
            string connectionString = Sitecore.Configuration.Settings.GetConnectionString("core");
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();
                using (SqlCommand command = connection.CreateCommand())
                {
                    command.CommandText = @"
                        SELECT TOP (1) 
                        [ESIID],
                        [TDU],
                        [FirstName],
                        [LastName],
                        [ServiceLine1],
                        [ServiceLine2],
                        [ServiceCity],
                        [ServiceStateAbbreviation],
                        [ServicePostalCode5],
                        [ServicePostalCodePlus4],
                        [PrimaryPhoneNumber],
                        [PrimaryPhoneType],
                        [EmailAddress],
                        [SocialSecurityNumber],
                        [MailingLine1],
                        [MailingLine2],
                        [MailingCity],
                        [MailingStateAbbreviation],
                        [MailingPostalCode5],
                        [MailingPostalCodePlus4]
                        FROM [SwitchBack] WHERE ESIID=@esiId";
                    command.Parameters.AddWithValue("@esiId", esiId);
                    using (var reader = command.ExecuteReader())
                    {
                        var userContext = new DomainModels.Enrollments.UserContext();
                        
                        if (reader.Read())
                        {
                            var serviceAddress = new DomainModels.Address { StateAbbreviation = (string)reader["ServiceStateAbbreviation"].ToString(), PostalCode5 = (string)reader["ServicePostalCode5"].ToString(), PostalCodePlus4 = (string)reader["ServicePostalCodePlus4"].ToString(), City = (string)reader["ServiceCity"].ToString(), Line1 = (string)reader["ServiceLine1"].ToString(), Line2 = (string)reader["ServiceLine2"].ToString() };

                            tdu = (string)reader["TDU"];
                            switch (tdu.ToLower())
                            {
                                case "aep central":
                                    tdu = "AEP Central Texas";
                                    break;
                                case "aep north":
                                    tdu = "AEP North Texas";
                                    break;
                                case "centerpoint":
                                    tdu = "Centerpoint";
                                    break;
                                case "oncor":
                                    tdu = "ONCOR";
                                    break;
                                case "sharyland":
                                    tdu = "Sharyland";
                                    break;
                                case "sharyland mcallen":
                                    tdu = "Sharyland McAllen";
                                    break;
                                case "tnmp":
                                    tdu = "TNMP";
                                    break;
                            }
                            
                            var location = new DomainModels.Enrollments.Location
                            {
                                Address = serviceAddress,
                                Capabilities = new DomainModels.IServiceCapability[]
                                {
                                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = tdu, EsiId = (string)reader["ESIID"] },
                                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.Switch },
                                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                                }
                            };
                            var primaryPhone = new DomainModels.TypedPhone
                            {
                                Number = reader.GetFieldValue<string>(10)
                            };
                            var customerContact = new CustomerContact
                            {
                                Name = new DomainModels.Name { First = (string)reader["FirstName"], Last = (string)reader["LastName"] },
                                Phone = new[] { 
                                new DomainModels.TypedPhone { Category = (string)reader["PrimaryPhoneType"].ToString() == "Home" ? PhoneCategory.Home : PhoneCategory.Mobile, Number = (string)reader["PrimaryPhoneNumber"].ToString() }
                            },
                                Email = new DomainModels.Email { Address = (string)reader["EmailAddress"].ToString() },
                            };
                            var socialSecurityNumber = (string)reader["SocialSecurityNumber"];
                            var mailingAddress = new DomainModels.Address
                            {
                                City = (string)reader["MailingCity"].ToString(),
                                StateAbbreviation = (string)reader["MailingStateAbbreviation"].ToString(),
                                Line1 = (string)reader["MailingLine1"].ToString(),
                                Line2 = (string)reader["MailingLine2"].ToString(),
                                PostalCode5 = (string)reader["MailingPostalCode5"].ToString(),
                                PostalCodePlus4 = (string)reader["MailingPostalCodePlus4"].ToString(),
                            };

                            // make sure the location is eligible for an enrollment
                            PremiseVerificationResult isEligible = await enrollmentService.VerifyPremise(location);
                            if (isEligible != PremiseVerificationResult.Success)
                            {
                                var ineligibleResult = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
                                ineligibleResult.Validations = Enumerable.Repeat(new TranslatedValidationResult { MemberName = "Location Ineligible", Text = "Location Ineligible" }, 1);
                                return ineligibleResult;
                            }

                            // run the load offers call to get offers for this address
                            stateHelper.InternalContext.AllOffers = await enrollmentService.LoadOffers(new Location[] { location });
                            var texasElectricityOffer = stateHelper.InternalContext.AllOffers.First().Value.Offers.Where(offer => offer.Id.Contains(request.PlanId)).FirstOrDefault() as DomainModels.Enrollments.TexasElectricity.Offer;
                            var offerOption = new DomainModels.Enrollments.TexasElectricity.OfferOption {};
                            userContext.ContactInfo = customerContact;
                            userContext.SocialSecurityNumber = socialSecurityNumber;
                            userContext.Services = new DomainModels.Enrollments.LocationServices[]
                                {
                                    new DomainModels.Enrollments.LocationServices 
                                    { 
                                        Location = location, 
                                        SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                                        {
                                            new DomainModels.Enrollments.SelectedOffer
                                            {
                                                Offer = texasElectricityOffer,
                                                OfferOption = offerOption,
                                            }
                                        }
                                    }
                                };
                            userContext.MailingAddress = mailingAddress.Line1 == "" ? serviceAddress : mailingAddress;

                            // save the data in the stateMachine  
                            stateHelper.Context.ContactInfo = userContext.ContactInfo;
                            stateHelper.Context.SecondaryContactInfo = userContext.SecondaryContactInfo;
                            stateHelper.Context.MailingAddress = userContext.MailingAddress;
                            stateHelper.Context.SocialSecurityNumber = "00000" + userContext.SocialSecurityNumber;
                            stateHelper.Context.Services = userContext.Services;
                            stateHelper.Context.IsSinglePage = true;
                            await stateMachine.ContextUpdated();

                            var result = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));

                            // return the data to the page
                            return result;
                        }
                        else
                        {
                            // if this was the second time through and the initial ESIID was valid, check the new address
                            if (stateHelper.Context.IsSinglePage)
                            {
                                // make sure the location is eligible for an enrollment
                                var temp = new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.Switch };
                                request.ServiceLocation.Capabilities = new DomainModels.IServiceCapability[]
                                {
                                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = tdu, EsiId = esiId },
                                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.Switch },
                                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                                };
                                PremiseVerificationResult isEligible = await enrollmentService.VerifyPremise(request.ServiceLocation);
                                if (isEligible != PremiseVerificationResult.Success)
                                {
                                    var ineligibleResult = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
                                    ineligibleResult.Validations = Enumerable.Repeat(new TranslatedValidationResult { MemberName = "Location Ineligible", Text = "Location Ineligible" }, 1);
                                    ineligibleResult.ExpectedState = Models.Enrollment.ExpectedState.PlanSelection;
                                    return ineligibleResult;
                                }

                                // run the load offers call to get offers for this address
                                stateHelper.InternalContext.AllOffers = await enrollmentService.LoadOffers(new Location[] { request.ServiceLocation });
                                var texasElectricityOffer = stateHelper.InternalContext.AllOffers.First().Value.Offers.Where(offer => offer.Id.Contains(request.PlanId)).FirstOrDefault() as DomainModels.Enrollments.TexasElectricity.Offer;
                                var offerOption = new DomainModels.Enrollments.TexasElectricity.OfferOption { };
                                userContext.Services = new DomainModels.Enrollments.LocationServices[]
                                {
                                    new DomainModels.Enrollments.LocationServices 
                                    { 
                                        Location = request.ServiceLocation, 
                                        SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                                        {
                                            new DomainModels.Enrollments.SelectedOffer
                                            {
                                                Offer = texasElectricityOffer,
                                                OfferOption = offerOption,
                                            }
                                        }
                                    }
                                };
                                stateHelper.Context.Services = userContext.Services;
                                await stateMachine.ContextUpdated();

                                var result = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));

                                // return the data to the page
                                return result;
                            }
                            else
                            {
                                // if the ESIID isn't in the list, return a validation error
                                var invalidResult = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
                                invalidResult.Validations = Enumerable.Repeat(new TranslatedValidationResult { MemberName = "ESIID Invalid", Text = "ESIID Invalid" }, 1);
                                invalidResult.ExpectedState = Models.Enrollment.ExpectedState.PlanSelection;
                                return invalidResult;
                            }
                        }
                    }
                }
            }
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

            bool isNeedsRefresh = stateMachine.Context.NeedsRefresh;
            if (isNeedsRefresh)
            {
                Reset();
            }

            var loggedInCustomerID = stateMachine.Context.LoggedInCustomerId;
            
            List<AddLineSubaccount> subaccounts = new List<AddLineSubaccount>();
            if (stateMachine.Context.AddLineSubAccounts != null && stateMachine.Context.AddLineSubAccounts.Count() > 0) {
                for (int i = 0; i < stateMachine.Context.AddLineSubAccounts.Count(); i++) {
                    var subaccount = (MobileAccount)stateMachine.Context.AddLineSubAccounts.ElementAt(i);

                    subaccounts.Add(new AddLineSubaccount()
                    {
                        PlanID = subaccount.PlanId,
                        IMEI = subaccount.SerialNumber,
                        Name = subaccount.PlanName,
                        Cost = subaccount.PlanPrice,
                        DataAvailable = subaccount.PlanDataAvailable
                    });
                }
            }

            return new ClientData
            {
                IsTimeout = stateHelper.IsNewSession,
                IsLoading = isLoading,
                Validations = validations,
                ExpectedState = expectedState,
                IsRenewal = stateMachine.Context.IsRenewal,
                IsAddLine = stateMachine.Context.IsAddLine,
                AddLineAccountNumber = stateMachine.Context.AddLineAccountNumber,
                AddLineSubAccounts = stateMachine.Context.IsAddLine ? subaccounts.ToArray() : null,
                AddLineAutoPay = stateMachine.Context.IsAddLine ? stateMachine.Context.AddLineAutoPay : false,
                IsSinglePage = stateMachine.Context.IsSinglePage,
                LoggedInCustomerId = stateMachine.Context.LoggedInCustomerId,
                AgreeToTerms = stateMachine.Context.AgreeToTerms,
                AdditionalAuthorizations = stateMachine.Context.AdditionalAuthorizations,
                AgreeToAutoPayTerms = stateMachine.Context.AgreeToAutoPayTerms,
                EnrolledInAutoPay = stateMachine.Context.EnrolledInAutoPay,
                AutoPayDiscount = stateMachine.Context.AutoPayDiscount,
                NewAccountUserName = stateMachine.Context.OnlineAccount == null ? "" : stateMachine.Context.OnlineAccount.Username,
                LoggedInAccountDetails = stateMachine.Context.LoggedInAccountDetails,
                RenewalESIID = stateMachine.Context.RenewalESIID,
                RenewalProviderID = stateMachine.Context.RenewalProviderID,
                PaymentError = stateMachine.Context.PaymentError,
                NeedsRefresh = isNeedsRefresh,
                ContactInfo = stateMachine.Context.ContactInfo,
                ContactTitle = stateMachine.Context.ContactTitle,
                CompanyName = stateMachine.Context.CompanyName,
                PreferredSalesExecutive = stateMachine.Context.PreferredSalesExecutive,
                TaxID = stateMachine.Context.TaxId,
                Last4SSN = string.IsNullOrEmpty(stateMachine.Context.SocialSecurityNumber) ? "" : stateMachine.Context.SocialSecurityNumber.Substring(5),
                Language = stateMachine.Context.Language,
                SecondaryContactInfo = stateMachine.Context.SecondaryContactInfo,
                MailingAddress = stateMachine.Context.MailingAddress,
                PreviousAddress = stateMachine.Context.PreviousAddress,
                AssociateInformation = stateMachine.InternalContext.AssociateInformation,
                AssociateName = stateMachine.Context.AssociateName,
                AssociateEmailSent = stateMachine.InternalContext.AssociateEmailSent,
                EnrollmentScreenshotTaken = stateMachine.InternalContext.EnrollmentScreenshotTaken,
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
                                                                                    ?? renewalConfirmations.ConfirmationNumber,
                                                                               ConfirmationStatus = confirmations.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id).Select(entry => entry.Details.ConfirmationStatus).FirstOrDefault() ?? "",
                                                                               DepositType = GetDepositType(selectedOffer),
                                                                               ConfirmationDetails = confirmations.Where(entry => entry.Location == service.Location && entry.Offer.Id == selectedOffer.Offer.Id && entry.Details is PlaceMobileOrderResult).Select(entry => ((PlaceMobileOrderResult)entry.Details).PhoneNumber).FirstOrDefault(),
                                                                               RenewalConfirmation = renewalConfirmations
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

        private string GetDepositType(SelectedOffer selectedOffer)
        {
            if (selectedOffer.DepositAlternative)
            {
                return "DepositAlternative";
            }
            if (selectedOffer.WaiveDeposit)
            {
                return "DepositWaived";
            }
            return "Deposit";
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
                Reset();
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
            else if (stateMachine.State == typeof(CompleteOrderState))
            {
                return Models.Enrollment.ExpectedState.ReviewOrder;
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
        public async Task<ClientData> SetAutoPay([FromBody]SetAutoPayRequest request)
        {
            await Initialize();
            stateMachine.Context.EnrolledInAutoPay = request.IsAutoPay;
            if (stateHelper.InternalContext != null)
            {
                stateHelper.InternalContext.Deposit = null;
            }
            var context = stateHelper.Context;
            var internalContext = stateHelper.InternalContext;
            stateHelper.Reset();
            stateHelper.Context = context;
            stateHelper.InternalContext = internalContext;

            stateHelper.State = typeof(AccountInformationState);

            await stateHelper.EnsureInitialized();

            this.stateMachine = stateHelper.StateMachine;

            await stateMachine.ContextUpdated();

            MapCartToServices(new AccountInformation {
                Cart = request.Cart
            });

            await stateMachine.ContextUpdated();

            await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));

            return ClientData(typeof(DomainModels.Enrollments.VerifyIdentityState), typeof(DomainModels.Enrollments.PaymentInfoState));
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
            /* Disable logged in enrollment for now
            
            if (currentUser.StreamConnectCustomerId != Guid.Empty && stateMachine.Context.LoggedInCustomerId == Guid.Empty)
            {
                var accounts = (await accountService.GetAccounts(currentUser.StreamConnectCustomerId)).Take(3);

                await Task.WhenAll((from account in accounts
                                    select Task.Factory.StartNew(async () =>
                                    {
                                        await accountService.GetAccountDetails(account, false);
                                    }).Result).ToArray());

                stateMachine.Context.LoggedInCustomerId = currentUser.StreamConnectCustomerId;
                stateMachine.Context.LoggedInAccountDetails =  (from account in accounts
                                     select new UserAccountDetails
                                     {
                                         ContactInfo = account.Details.ContactInfo,
                                         MailingAddress = account.Details.BillingAddress,
                                     }).ToArray();
            }
            */
            return ClientData(typeof(DomainModels.Enrollments.AccountInformationState));
        }

        private async Task ResetPreAccountInformation()
        {
            if (stateHelper.Context.IsRenewal  || stateMachine.Context.IsAddLine || stateHelper.Context.IsSinglePage)
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
            if (request.Cart.Any(CartEntry => CartEntry.OfferInformationByType.Any(offer => offer.Key == "Mobile")))
            {
                stateMachine.Context.EnrolledInAutoPay = true;
            }
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
            stateMachine.Context.DOB = request.DOB;
            stateMachine.Context.Gender = request.Gender;
            stateMachine.Context.KIQFailOption = request.KIQFailOption;
            stateMachine.Context.PreviousAddress = request.PreviousAddress;

            stateMachine.Context.MailingAddress = request.MailingAddress;

            stateMachine.Context.TaxId = request.TaxId;
            stateMachine.Context.CompanyName = request.CompanyName;
            stateMachine.Context.DoingBusinessAs = request.DoingBusinessAs;
            stateMachine.Context.PreferredSalesExecutive = request.PreferredSalesExecutive;
            stateMachine.Context.UnderContract = request.UnderContract;

            stateMachine.Context.AssociateName = request.AssociateName;

            stateMachine.Context.TrustEvSessionId = request.TrustEvSessionId;

            await stateMachine.ContextUpdated();

            MapCartToServices(request);

            await stateMachine.ContextUpdated();

            if (stateMachine.State == typeof(DomainModels.Enrollments.AccountInformationState) || stateMachine.State == typeof(DomainModels.Enrollments.PlanSelectionState))
                await stateMachine.Process(typeof(DomainModels.Enrollments.OrderConfirmationState));
            else if ((stateMachine.Context.IsRenewal || stateMachine.Context.IsSinglePage) && stateMachine.State == typeof(DomainModels.Enrollments.LoadDespositInfoState))
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
            if (stateMachine.Context.IsSinglePage)
            {
                await stateMachine.Process();
            }
            else
            {
                await stateMachine.Process(typeof(DomainModels.Enrollments.CompleteOrderState));
            }

            var resultData = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
            await GenerateEndOfEnrollmentScreenshot(resultData);
            await SendAssociateNameEmail(resultData);
            await SendMobileNextSteps(resultData);
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
            
            if (stateMachine.Context.Services == null || stateMachine.Context.ContactInfo == null || request == null)
            {
                //If session timed out before complete order, need to refresh the page and go back to step 1.
                stateMachine.Context.NeedsRefresh = true;
                return ClientData();
            }

            stateMachine.Context.PaymentInfo = request.PaymentInfo;
            if (stateMachine.Context.PaymentInfo is DomainModels.Payments.TokenizedCard && string.IsNullOrEmpty(((DomainModels.Payments.TokenizedCard)stateMachine.Context.PaymentInfo).Name))
            {
                ((DomainModels.Payments.TokenizedCard)stateMachine.Context.PaymentInfo).Name = stateMachine.Context.ContactInfo.Name.First + " " + stateMachine.Context.ContactInfo.Name.Last;
            }
            stateMachine.Context.AdditionalAuthorizations = request.AdditionalAuthorizations ?? new Dictionary<AdditionalAuthorization, bool>();
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;
            stateMachine.Context.AgreeToAutoPayTerms = request.AgreeToAutoPayTerms;
            stateMachine.Context.W9BusinessData = request.W9BusinessData;
            stateMachine.Context.AutoPayDiscount = Convert.ToDecimal(settings.GetSettingsValue("Mobile Enrollment Options", "AutoPay Discount"));
            
            foreach (var locationService in stateMachine.Context.Services)
            {
                foreach (var offer in locationService.SelectedOffers)
                {
                    offer.WaiveDeposit = false;
                    offer.DepositAlternative = false;
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
            foreach (var depositAlternative in request.DepositAlternatives ?? Enumerable.Empty<DepositAlternative>())
            {
                var locationService = stateMachine.Context.Services.FirstOrDefault(svc => svc.Location == depositAlternative.Location);
                if (locationService != null)
                {
                    var target = locationService.SelectedOffers.FirstOrDefault(sel => sel.Offer.Id == depositAlternative.OfferId);
                    target.DepositAlternative = true;
                }
            }

            await stateMachine.ContextUpdated();

            await stateMachine.Process();

            var resultData = ClientData();

            await GenerateEndOfEnrollmentScreenshot(resultData);
            await SendAssociateNameEmail(resultData);
            await SendMobileNextSteps(resultData);
            return resultData;
        }

        [HttpPost]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<ClientData> SinglePageOrder([FromBody]SinglePageOrder request)
        {
            await Initialize();

            // Update the stateMachine with the form Data
            stateMachine.Context.ContactInfo = request.ContactInfo;
            stateMachine.Context.SecondaryContactInfo = request.SecondaryContactInfo;
            stateMachine.Context.MailingAddress = request.MailingAddress;
            stateMachine.Context.AgreeToTerms = request.AgreeToTerms;
            stateMachine.Context.AdditionalAuthorizations = request.AdditionalAuthorizations ?? new Dictionary<AdditionalAuthorization, bool>();
            stateHelper.State = typeof(DomainModels.Enrollments.AccountInformationState);

            // Verify the SSN
            if (stateMachine.Context.SocialSecurityNumber.Substring(stateMachine.Context.SocialSecurityNumber.Length - 4) != request.SocialSecurityNumber.Substring(request.SocialSecurityNumber.Length - 4)) 
            {
                var ineligibleResult = ClientData(typeof(DomainModels.Enrollments.PaymentInfoState));
                ineligibleResult.Validations = Enumerable.Repeat(new TranslatedValidationResult { MemberName = "SSN Mismatch", Text = "SSN Mismatch" }, 1);
                ineligibleResult.ExpectedState = Models.Enrollment.ExpectedState.PlanSelection;
                return ineligibleResult;
            }
            stateMachine.Context.SocialSecurityNumber = request.SocialSecurityNumber;

            // Finalize the Enrollment
            foreach (var locationService in stateMachine.Context.Services)
            {
                foreach (var offer in locationService.SelectedOffers)
                {
                    offer.WaiveDeposit = false;
                    offer.DepositAlternative = false;
                }
            }

            await stateMachine.ContextUpdated();

            await stateMachine.Process();

            var resultData = ClientData();

            await GenerateEndOfEnrollmentScreenshot(resultData);

            // Send the response
            return resultData;

        }

        private async Task GenerateEndOfEnrollmentScreenshot(Models.Enrollment.ClientData resultData)
        {
            if (redisDatabase != null && resultData.ExpectedState == Models.Enrollment.ExpectedState.OrderConfirmed && !resultData.EnrollmentScreenshotTaken)
            {
                await redisDatabase.ListRightPushAsync("EnrollmentScreenshots", StreamEnergy.Json.Stringify(resultData));
                stateMachine.InternalContext.EnrollmentScreenshotTaken = true;
            }
        }

        private async Task SendAssociateNameEmail(Models.Enrollment.ClientData resultData)
        {
            if (resultData.ExpectedState == Models.Enrollment.ExpectedState.OrderConfirmed && !resultData.AssociateEmailSent)
            {
                var acctNumbers = (from product in resultData.Cart
                                   from offerInformation in product.OfferInformationByType
                                   from selectedOffer in offerInformation.Value.OfferSelections
                                   select selectedOffer.ConfirmationNumber).Distinct().ToArray();
                if (!string.IsNullOrEmpty(resultData.AssociateName))
                {
                    var to = settings.GetSettingsValue("Enrollment Associate Name", "Email Address");

                    var customerName = resultData.ContactInfo.Name.First + " " + resultData.ContactInfo.Name.Last;
                    var customerPhone = "";

                    foreach (var phone in resultData.ContactInfo.Phone)
                    {
                        customerPhone += customerPhone == "" ? "" : ", ";
                        customerPhone += phone.Number;
                    }
                    customerPhone = customerPhone == "" ? "N/A" : customerPhone;

                    await emailService.SendEmail(new Guid("{DA3290DF-BCC3-44DF-A099-AA9E74D800CC}"), to, new NameValueCollection() {
                        {"customerName", customerName},
                        {"customerPhone", customerPhone},
                        {"associateName", resultData.AssociateName},
                        {"sessionId", HttpContext.Current.Session.SessionID},
                        {"accountNumbers", string.Join(",", acctNumbers)},
                    });
                }
                if (resultData.AssociateInformation == null && !resultData.IsRenewal && !resultData.IsSinglePage)
                {
                    await logger.Record(new LogEntry()
                    {
                        Data = {
                            { "AssociateName", resultData.AssociateName },
                            { "AccountNumbers", acctNumbers },
                        },
                    });
                }
                stateMachine.InternalContext.AssociateEmailSent = true;
            }
        }

        private async Task SendMobileNextSteps(Models.Enrollment.ClientData resultData)
        {
            if (resultData.ExpectedState == Models.Enrollment.ExpectedState.OrderConfirmed && !resultData.MobileNextStepsEmailSent)
            {
                var acctNumbers = (from product in resultData.Cart
                                       from offerInformation in product.OfferInformationByType
                                           where offerInformation.Key == "Mobile"
                                           from selectedOffer in offerInformation.Value.OfferSelections
                                               where !selectedOffer.ConfirmationSuccess
                                               select selectedOffer.ConfirmationNumber).Distinct().ToArray();

                if (acctNumbers.Length != 0 && false)
                {
                    string emailType = (from product in resultData.Cart
                                        from offerInformation in product.OfferInformationByType
                                        where offerInformation.Key == "Mobile"
                                        from selectedOffer in offerInformation.Value.OfferSelections
                                        select selectedOffer.ConfirmationStatus).FirstOrDefault().ToLower();

                    string to = resultData.ContactInfo.Email.Address.ToString();
                    string customerName = resultData.ContactInfo.Name.First + " " + resultData.ContactInfo.Name.Last;

                    if (emailType == "pending")
                    {
                        await emailService.SendEmail(new Guid("{006D3E9E-AA1D-4B44-A2E8-E531C828137A}"), to, new NameValueCollection() {
                            {"customerName", customerName},
                            {"accountNumbers", string.Join(", ", acctNumbers)},
                        });
                    }
                    else if (emailType == "pending review")
                    {
                        await emailService.SendEmail(new Guid("{86A3E0E6-CC5A-43C8-8F11-AE9F352FF07C}"), to, new NameValueCollection() {
                            {"customerName", customerName},
                            {"accountNumbers", string.Join(", ", acctNumbers)},
                        });
                    }
                    else if (emailType == "submitted")
                    {
                        await emailService.SendEmail(new Guid("{83210888-B623-4589-A679-E532144053F7}"), to, new NameValueCollection() {
                            {"customerName", customerName},
                            {"accountNumbers", string.Join(", ", acctNumbers)},
                        });
                    }
                }
                stateMachine.InternalContext.MobileNextStepsEmailSent = true;
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