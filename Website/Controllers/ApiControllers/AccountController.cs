using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;
using StreamEnergy.MyStream.Models.Authentication;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Net.Mail;
using System.Net.Http;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Security;
using System.Web.SessionState;
using Microsoft.Practices.Unity;
using System.Threading.Tasks;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    public class AccountController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly Services.Clients.ITemperatureService temperatureService;
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly IValidationService validation;

        public AccountController(IUnityContainer container, HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, Services.Clients.ITemperatureService temperatureService, IValidationService validation)
        {
            this.container = container;
            this.temperatureService = temperatureService;
            this.accountService = accountService;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Account/Profile");
            this.validation = validation;
        }

        [HttpGet]
        public string CelciusToFahrenheit(string celcius)
        {
            return temperatureService.CelciusToFahrenheit(celcius: celcius);
        }

        [HttpGet]
        public string FahrenheitToCelcius(string fahrenheit)
        {
            return temperatureService.FahrenheitToCelcius(fahrenheit: fahrenheit);
        }

        [HttpGet]
        public Task<string> ExampleMock()
        {
            return temperatureService.MockedExample();
        }

        [HttpGet]
        public Task<Dictionary<string, object>> ExampleCache()
        {
            return temperatureService.CachedExample();
        }

        #region Utiltiy Providers

        [HttpGet]
        public GetUtilityProvidersResponse GetUtilityProviders()
        {
            // TODO - get the providers from Stream Connect 

            return new GetUtilityProvidersResponse
            {
                Providers = new[] { "PECO", "PPL" }
            };
        }

        #endregion

        #region Invoices

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public GetInvoicesResponse GetInvoices()
        {
            // TODO - get the invoices from Stream Connect and format the response

            return new GetInvoicesResponse
            {
                Invoices = new Table<Models.Account.Invoice>
                {
                    ColumnList = typeof(StreamEnergy.MyStream.Models.Account.Invoice).BuildTableSchema(database.GetItem("/sitecore/content/Data/Components/Account/Overview/My Invoices")),
                    Values = from account in accountService.GetInvoices(User.Identity.Name)
                             from invoice in account.Invoices
                             select new StreamEnergy.MyStream.Models.Account.Invoice
                             {
                                 AccountNumber = account.AccountNumber,
                                 ServiceType = account.AccountType,
                                 InvoiceNumber = invoice.InvoiceNumber,
                                 InvoiceAmount = invoice.InvoiceAmount.ToString("0.00"),
                                 DueDate = invoice.DueDate.ToShortDateString(),
                                 IsPaid = invoice.IsPaid,
                                 CanRequestExtension = account.GetCapability<InvoiceExtensionAccountCapability>().CanRequestExtension,
                                 Actions = 
                                 {
                                     { "viewPdf", "http://.../" }
                                 }
                             }
                }
            };
        }

        #endregion

        #region Payment History

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public GetPaymentsResponse GetPayments()
        {
            // TODO - get the invoices from Stream Connect and format the response

            var row1 = new StreamEnergy.MyStream.Models.Account.Payment
            {
                AccountNumber = "1197015532",
                ServiceType = "HomeLife Services",
                ConfirmCode = "1030523546381",
                PaymentAmount = "$24.99",
                PaymentDate = "04/05/14",
                Status = "PENDING",
                IsRecurring = true,
                PaymentID = "1234567890",
                PaymentMode = "ACH",
                PaymentAccount = "*********1234",
                RoutingNumber = "1234567890",
                PaymentMadeBy = "Jordan Campbell",
                Actions = 
                {
                    { "showDetails", "" }
                }
            };

            var row2 = new StreamEnergy.MyStream.Models.Account.Payment
            {
                AccountNumber = "219849302",
                ServiceType = "Utility",
                ConfirmCode = "1020453546012",
                PaymentAmount = "$93.72",
                PaymentDate = "03/13/14",
                Status = "APPROVED",
                IsRecurring = false,
                PaymentID = "1234567890",
                PaymentMode = "ACH",
                PaymentAccount = "*********7844",
                RoutingNumber = "1234567890",
                PaymentMadeBy = "Jordan Campbell",
                Actions = 
                {
                    { "showDetails", "" }
                }
            };

            var row3 = new StreamEnergy.MyStream.Models.Account.Payment
            {
                AccountNumber = "219849302",
                ServiceType = "Utility",
                ConfirmCode = "1020474538566",
                PaymentAmount = "$88.58",
                PaymentDate = "02/10/14",
                Status = "APPROVED",
                IsRecurring = false,
                PaymentID = "1234567890",
                PaymentMode = "ACH",
                PaymentAccount = "*********7844",
                RoutingNumber = "1234567890",
                PaymentMadeBy = "Michelle Campbell",
                Actions = 
                {
                    { "showDetails", "" }
                }
            };
            
            return new GetPaymentsResponse
            {
                Payments = new Table<Models.Account.Payment>
                {
                    ColumnList = typeof(StreamEnergy.MyStream.Models.Account.Payment).BuildTableSchema(database.GetItem("/sitecore/content/Data/Components/Account/Overview/My Payments")),
                    Values = new[] { row1, row2, row3 }
                }
            };
        }

        #endregion

        #region Utility Services

        [HttpPost]
        public GetElectricityPlanResponse GetElectricityPlan(GetUtiltiyPlansRequest request)
        {
            var accountNumber = request.AccountNumber;

            // TODO get the plan info from Stream Connect

            var electricityPlan = new UtilityPlan
            {
                UtilityType = "Electricity",
                PlanType = "Fixed",
                PlanName = "Flex Choice Intro Plan",
                Rate = "9.18",
                Terms = "Month-to-Month",
                Fees = "$0",
                PlanDetails = "The Stream Intro/Variable Price Plan is for new customers only and is the applied rate for the first invoice. I understand that, under this plan, I will receive a guaranteed introductory rate on my first invoice. All subsequent months will be billed at Stream Energy's then-current Variable Price Rate. Early Termination Fees shall NOT apply and that my current rate may fluctuate based on market conditions. Please see the Terms of Services for more information on this product.",
                PricingEffectiveDate = "11/21/2013",
                MinimumUsageFee = "$0.00",
                IsRenewable = true,
                RenewDate = "4/15/2014"
            };

            return new GetElectricityPlanResponse
            {
                ElectricityPlan = accountNumber == "1197015532" ? electricityPlan : null
            };
        }

        [HttpPost]
        public GetGasPlanResponse GetGasPlan(GetUtiltiyPlansRequest request)
        {
            var accountNumber = request.AccountNumber;

            // TODO get the plan info from Stream Connect

            var gasPlan = new UtilityPlan
            {
                UtilityType = "Gas",
                PlanType = "Fixed",
                PlanName = "Flex Choice Intro Plan",
                Rate = "4.98",
                Terms = "Month-to-Month",
                Fees = "$0",
                PlanDetails = "The Stream Intro/Variable Price Plan is for new customers only and is the applied rate for the first invoice. I understand that, under this plan, I will receive a guaranteed introductory rate on my first invoice. All subsequent months will be billed at Stream Energy's then-current Variable Price Rate. Early Termination Fees shall NOT apply and that my current rate may fluctuate based on market conditions. Please see the Terms of Services for more information on this product.",
                PricingEffectiveDate = "11/21/2013",
                MinimumUsageFee = "$0.00",
                IsRenewable = false
            };

            return new GetGasPlanResponse
            {
                GasPlan = accountNumber == "07644559" ? gasPlan : null
            };
        }

        #endregion

        #region Online Account Information

        [HttpGet]
        public GetOnlineAccountResponse GetOnlineAccount()
        {
            var username = User.Identity.Name;
            var profile = UserProfile.Locate(container, username);

            var email = new DomainModels.Email();
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");
            var languagesRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Languages");
            
            // TODO get email address from Stream Connect
            email.Address = "adam.powell@responsivepath.com";
            
            
            return new GetOnlineAccountResponse
            {
                Username = User.Identity.Name.Substring(User.Identity.Name.IndexOf('\\') + 1),
                Email = email,
                AvailableSecurityQuestions =
                    from questionItem in (questionsRoot != null ? questionsRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                    select new SecurityQuestion
                    {
                        Id = questionItem.ID.Guid,
                        Text = questionItem["Question"]
                    },
                Challenges = 
                    from challenge in profile.ChallengeQuestions.ToDictionary(c => c.QuestionKey, c => (string)null) ?? new Dictionary<Guid, string>()
                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                    select new AnsweredSecurityQuestion
                    {
                        SelectedQuestion = new SecurityQuestion
                        {
                            Id = challenge.Key,
                            Text = questionItem != null ? questionItem["Question"] : ""
                        }
                    },
                   
                AvailableLanguages =
                   from languageItem in (languagesRoot != null ? languagesRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                   select new LanguagePreference
                   {
                       Id = languageItem.ID.Guid,
                       Text = languageItem["Language"]
                   },
                // TODO get Language Preference from StreamConnect
                LanguagePreference = "English"
            };
        }

        [HttpPost]
        public UpdateOnlineAccountResponse UpdateOnlineAccount(UpdateOnlineAccountRequest request)
        {
            bool success = false;
            
            request.Username = domain.AccountPrefix + request.Username;

            if (User.Identity.Name != request.Username)
            {
                request.Username = null;
            }
            var validations = validation.CompleteValidate(request);
            if (!validations.Any())
            {
                var user = Membership.GetUser(User.Identity.Name);
                // TODO update the username

                // TODO update the email address with Stream Connect

                // update the password if it has been set
                if (!string.IsNullOrEmpty(request.CurrentPassword) )
                {
                    user.ChangePassword(request.CurrentPassword, request.Password);
                }
                // update the challeges
                if (request.Challenges != null && request.Challenges.Any(c => !string.IsNullOrEmpty(c.Answer)))
                {
                    var profile = UserProfile.Locate(container, request.Username);
                    
                    profile.ChallengeQuestions = (from entry in request.Challenges
                                                  join existing in profile.ChallengeQuestions on entry.SelectedQuestion.Id equals existing.QuestionKey into existing
                                                  let existingQuestion = existing.FirstOrDefault()
                                                  let useExistingQuestion = existingQuestion != null && string.IsNullOrEmpty(entry.Answer)
                                                  select useExistingQuestion ? existingQuestion : ChallengeResponse.Create(entry.SelectedQuestion.Id, entry.Answer)).ToArray();

                    profile.Save();
                }

                // TODO update the language preference with Stream Connect

                success = true;
                
            }

            return new UpdateOnlineAccountResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("My Online Account Information"))
            };
        }

        #endregion

        #region Account Selector

        [HttpGet]
        public IEnumerable<AccountGrouping> GetAccounts()
        {
            var serviceAddress = new DomainModels.Address
            {
                Line1 = "123 Main Street",
                City = "Dallas",
                StateAbbreviation = "TX",
                PostalCode5 = "75001"
            };

            var serviceAddress2 = new DomainModels.Address
            {
                Line1 = "456 Main Street",
                City = "Dallas",
                StateAbbreviation = "TX",
                PostalCode5 = "75001"
            };

            var serviceAddress3 = new DomainModels.Address
            {
                Line1 = "1 Georgia Dome Dr NW3",
                City = "Atlanta",
                StateAbbreviation = "GA",
                PostalCode5 = "30313"
            };

            var serviceAddress4 = new DomainModels.Address
            {
                Line1 = "2604 Washington Rd",
                City = "Augusta",
                StateAbbreviation = "GA",
                PostalCode5 = "30904"
            };

            var account1 = new AccountGrouping 
            {
                AccountNumber = "1197015532",
                SubAccountLabel = "ESI ID:",
                SubAccounts = new ISubAccount[] { new TexasElectricityAccount { Id = "109437200008913264", ServiceAddress = serviceAddress }, new TexasElectricityAccount { Id = "109437200008975832", ServiceAddress = serviceAddress2 } }
            };

            var account2 = new AccountGrouping
            {
                AccountNumber = "07644559",
                SubAccountLabel = "Meter ID:",
                SubAccounts = new ISubAccount[] { new GeorgiaElectricityAccount { Id = "9A743339875", ServiceAddress = serviceAddress3 }, new GeorgiaElectricityAccount { Id = "88-443672486", ServiceAddress = serviceAddress4 } }
            };

            return new AccountGrouping [] { account1, account2 } ;
        }

        #endregion

        #region Account Information

        [HttpPost]
        public GetAccountInformationResponse GetAccountInformation(GetAccountInformationRequest request)
        {
            var accountNumber = request.AccountNumber;
            var serviceAddress = new DomainModels.Address();
            var billingAddress = new DomainModels.Address();
            bool sameAsService = false;

            // TODO get the contact info from Stream Connect
            var customerName = new DomainModels.Name
            {
                First = "John",
                Last = "Smith"
            };

            var primaryPhone =  new DomainModels.TypedPhone { Number = "214-223-4567", Category = StreamEnergy.DomainModels.PhoneCategory.Home };
            var secondaryPhone = new DomainModels.TypedPhone { Number = "214-223-7323", Category = StreamEnergy.DomainModels.PhoneCategory.Mobile };

            serviceAddress.Line1 = "123 Main St.";
            serviceAddress.City = "Dallas";
            serviceAddress.StateAbbreviation = "TX";
            serviceAddress.PostalCode5 = "75001";

            billingAddress.Line1 = "123 Main St.";
            billingAddress.City = "Dallas";
            billingAddress.StateAbbreviation = "TX";
            billingAddress.PostalCode5 = "75001";

            if (serviceAddress.Equals(billingAddress))
            {
                sameAsService = true;
            }

            return new GetAccountInformationResponse
            {
                CustomerName = customerName,
                PrimaryPhone = primaryPhone,
                SecondaryPhone = secondaryPhone,
                ServiceAddress = serviceAddress,
                SameAsService = sameAsService,
                BillingAddress = billingAddress
            };
        }

        [HttpPost]
        public UpdateAccountInformationResponse UpdateAccountInformation(UpdateAccountInformationRequest request)
        {
            bool success = false;
            var validations = validation.CompleteValidate(request);
           
            var accountNumber = request.AccountNumber;

            // update the account information with Stream Connect
            if (!validations.Any())
            {
                success = true;
            }

            return new UpdateAccountInformationResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Change Password"))
            };
        }

        #endregion

        #region Notification Settings

        [HttpPost]
        public GetNotificationSettingsResponse GetNotificationSettings(GetNotificationSettingsRequest request)
        {
            // TODO get notificaiton settings from Stream Connect
            var accountNumber = request.AccountNumber;
            var newDocumentArrives = new NotificationSetting
            {
                Web = true,
                Email = true,
                Sms = true
            };
            var onlinePaymentsMade = new NotificationSetting
            {
                Web = true,
                Email = false,
                Sms = true
            };
            var recurringPaymentsMade = new NotificationSetting
            {
                Web = false,
                Email = false,
                Sms = true
            };
            var recurringProfileExpires = new NotificationSetting
            {
                Web = false,
                Email = true,
                Sms = true
            };

            return new GetNotificationSettingsResponse
            {
                AccountNumber = accountNumber,
                NewDocumentArrives = newDocumentArrives,
                OnlinePaymentsMade = onlinePaymentsMade,
                RecurringPaymentsMade = recurringPaymentsMade,
                RecurringProfileExpires = recurringProfileExpires,
                PrintedInvoices = true,
                PromoOptIn = false     
            };
        }

        [HttpPost]
        public UpdateNotificationResponse UpdateNotification(UpdateNotificationRequest request)
        {
            bool success = false;

            var accountNumber = request.AccountNumber;
            var notificationName = request.NotificationName;
            var notificationSetting = request.NotificationSetting;

            // TODO update the notification setting with Stream Connect
            if (true)
            {
                success = true;
            }

            return new UpdateNotificationResponse
            {
                Success = success
            };
        }

        [HttpPost]
        public UpdateNotificationSettingsResponse UpdateNotificationSettings(UpdateNotificationSettingsRequest request)
        {
            bool success = false;

            var accountNumber = request.AccountNumber;

            // TODO update the notification settings with Stream Connect
            if (true)
            {
                success = true;
            }


            return new UpdateNotificationSettingsResponse
            {
                Success = success
            };
        }

        #endregion

        #region Enrolled Accounts

        [HttpGet]
        public GetEnrolledAccountsResponse GetEnrolledAccounts()
        {
            // TODO get enrolled accounts from Stream Connect
            var account1 = new EnrolledAccount
            {
                AccountNumber = "1234567890",
                DateAdded = Convert.ToDateTime("12/28/2013  17:33:15"),
                SendLetter = true
            };
            var account2 = new EnrolledAccount
            {
                AccountNumber = "0987654321",
                DateAdded = Convert.ToDateTime("06/12/2014  11:40:55"),
                SendLetter = false
            };
            IEnumerable<EnrolledAccount> enrolledAccounts = new EnrolledAccount[] {account1, account2};

            return new GetEnrolledAccountsResponse
            {
                EnrolledAccounts = enrolledAccounts
            };
        }

        [HttpPost]
        public AddNewAccountResponse AddNewAccount(AddNewAccountRequest request)
        {
            bool success = false;
            var validations = validation.CompleteValidate(request);

            var accountNumber = request.AccountNumber;
            var ssnLastFour = request.SsnLastFour;

            // TODO add the new account with Stream Connect
            if (!validations.Any())
            {
                success = true;
            }

            return new AddNewAccountResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Add New Account"))
            };
        }

        [HttpPost]
        public RemoveAccountResponse RemoveEnrolledAccount(RemoveAccountRequest request)
        {
            bool success = false;

            var accountNumber = request.AccountNumber;

            // TODO remove enrolled account with Stream Connect
            if (true)
            {
                success = true;
            }

            return new RemoveAccountResponse
            {
                Success = success
            };
        }

        [HttpPost]
        public SendLetterResponse SendLetter(SendLetterRequest request)
        {
            bool success = false;

            var accountNumber = request.AccountNumber;

            // TODO send the letter with Stream Connect
            if (true)
            {
                success = true;
            }

            return new SendLetterResponse
            {
                Success = success
            };
        }

        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

    }
}