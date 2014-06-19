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

namespace StreamEnergy.MyStream.Controllers
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

        #region Invoices

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public Table<StreamEnergy.MyStream.Models.Account.Invoice> Invoices(bool schema = true)
        {
            return new Table<StreamEnergy.MyStream.Models.Account.Invoice>
                {
                    // TODO - provide translation sitecore item
                    ColumnList = schema ? typeof(StreamEnergy.MyStream.Models.Account.Invoice).BuildTableSchema(null) : null,
                    Values = from invoice in accountService.GetInvoices(User.Identity.Name)
                             select new StreamEnergy.MyStream.Models.Account.Invoice
                             {
                                 AccountNumber = invoice.AccountNumber,
                                 ServiceType = invoice.ServiceType,
                                 InvoiceNumber = invoice.InvoiceNumber,
                                 InvoiceAmount = invoice.InvoiceAmount.ToString("0.00"),
                                 DueDate = invoice.DueDate.ToShortDateString(),
                                 IsPaid = invoice.IsPaid,
                                 CanRequestExtension = invoice.CanRequestExtension,
                                 Actions = 
                                 {
                                     { "viewPdf", "http://.../" }
                                 }
                             }
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
            // make sure this is the currently logged in user
            if (User.Identity.Name != request.Username)
            {
                request.Username = null;
            }
            var validations = validation.CompleteValidate(request);
            if (!validations.Any())
            {
                var user = Membership.GetUser(User.Identity.Name);
                // update the username

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
        public GetAccountsResponse GetAccounts()
        {
            // TODO check to make sure the user is logged in, and get the username from the current session

            return new GetAccountsResponse
            {
                
            };
        }

        #endregion

        #region Account Information

        [HttpPost]
        public GetAccountInformationResponse GetAccountInformation(GetAccountInformationRequest request)
        {
            // TODO check to make sure the user is logged in

            var accountId = request.AccountId;
            var serviceAddress = new DomainModels.Address();
            var billingAddress = new DomainModels.Address();
            bool sameAsService = false;

            // TODO get the contact info from Stream Connect
            var customerName = new DomainModels.Name
            {
                First = "John",
                Last = "Smith"
            };
            var primaryPhone = new DomainModels.Phone
            {
                Number = "222-222-2222",
            };

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
                SecondaryPhone = primaryPhone,
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

            // TODO check to make sure the user is logged in
           
            var accountId = request.AccountId;

            // update the account information with Stream Connect
            if (true)
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
            // TODO check to make sure the user is logged in

            // TODO get notificaiton settings from Stream Connect
            var accountId = request.AccountId;
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
                AccountId = accountId,
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
            
            // TODO check to make sure the user is logged in

            var accountId = request.AccountId;
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

            // TODO check to make sure the user is logged in

            var accountId = request.AccountId;

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
            // TODO check to make sure the user is logged in

            // TODO get enrolled accounts from Stream Connect
            var account1 = new EnrolledAccount
            {
                AccountNumber = "1234567890",
                DateAdded = Convert.ToDateTime("12/28/2013  17:33:15")
            };
            var account2 = new EnrolledAccount
            {
                AccountNumber = "0987654321",
                DateAdded = Convert.ToDateTime("06/12/2014  11:40:55")
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

            // TODO check to make sure the user is logged in

            var accountNumber = request.AccountNumber;
            var ssnLastFour = request.SsnLastFour;

            // TODO add the new account with Stream Connect
            if (true)
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

            // TODO check to make sure the user is logged in

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

            // TODO check to make sure the user is logged in

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

        private void AddAuthenticationCookie(HttpResponseMessage response, string username)
        {
            var cookie = FormsAuthentication.GetAuthCookie(domain.AccountPrefix + username, false, "/");
            response.Headers.AddCookies(new[] {
                    new System.Net.Http.Headers.CookieHeaderValue(cookie.Name, cookie.Value) 
                    { 
                        Domain = cookie.Domain, 
                        Expires = cookie.Expires == DateTime.MinValue ? null : (DateTime?)cookie.Expires, 
                        HttpOnly = cookie.HttpOnly, 
                        Path = cookie.Path, 
                        Secure = cookie.Secure 
                    }
                });
        }

    }
}