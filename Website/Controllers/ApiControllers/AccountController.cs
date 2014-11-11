using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.Processes;
using StreamEnergy.Services.Clients;
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
using ResponsivePath.Validation;
using Sitecore.Links;
using StackExchange.Redis;

namespace StreamEnergy.MyStream.Controllers.ApiControllers
{
    
    public class AccountController : ApiController, IRequiresSessionState
    {
        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly DomainModels.Payments.IPaymentService paymentService;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly IValidationService validation;
        private readonly StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication;
        private readonly ICurrentUser currentUser;
        private readonly EnrollmentController enrollmentController;
        private readonly IDatabase redis;
        private const string redisPrefix = "AddNewAccount_FindAccount_";

        public AccountController(IUnityContainer container, HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, DomainModels.Payments.IPaymentService paymentService, IValidationService validation, StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication, ICurrentUser currentUser, EnrollmentController enrollmentController, IDatabase redis)
        {
            this.container = container;
            this.accountService = accountService;
            this.paymentService = paymentService;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Account/Profile");
            this.validation = validation;
            this.authentication = authentication;
            this.currentUser = currentUser;
            this.enrollmentController = enrollmentController;
            this.redis = redis;
        }

        #region Account Balances & Payments

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<GetAccountBalancesResponse> GetAccountBalances()
        {
            currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            var acocuntInvoices = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts);

            return new GetAccountBalancesResponse
            {
                Accounts =  from account in currentUser.Accounts
                            let invoice = acocuntInvoices.First(t => t.AccountNumber == account.AccountNumber && t.Invoices != null).Invoices.LastOrDefault()
                            select CreateViewAccountBalances(account, invoice)
            };
        }

        private static Models.Account.AccountToPay CreateViewAccountBalances(Account account, DomainModels.Accounts.Invoice invoice)
        {
            var result = new StreamEnergy.MyStream.Models.Account.AccountToPay
            {
                AccountNumber = account.AccountNumber,
                AmountDue = account.Balance.Balance,
                DueDate = account.Balance.DueDate,
                UtilityProvider = account.GetCapability<ExternalPaymentAccountCapability>().UtilityProvider,
                CanMakeOneTimePayment = account.GetCapability<PaymentSchedulingAccountCapability>().CanMakeOneTimePayment,
                AvailablePaymentMethods = account.GetCapability<PaymentMethodAccountCapability>().AvailablePaymentMethods.ToArray(),
            };

            if (invoice.PdfAvailable)
            {
                result.Actions.Add("viewPdf", "/api/account/invoicePdf?account=" + account.AccountNumber + "&invoice=" + invoice.InvoiceNumber);
            }

            return result;
        }

        #endregion

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

        #region Energy Usage

        [HttpPost]
        public GetEnergyUsageResponse GetEnergyUsage(GetEnergyUsageRequest request)
        {
            var accountNumber = request.AccountNumber;

            // TODO get the energy usage from Stream Connect

            var jan = new UtilityUsage { Month = 1, Year = 2013, Usage = 80 };
            var feb = new UtilityUsage { Month = 2, Year = 2013, Usage = 70 };
            var mar = new UtilityUsage { Month = 3, Year = 2013, Usage = 80 };
            var apr = new UtilityUsage { Month = 4, Year = 2013, Usage = 110 };
            var may = new UtilityUsage { Month = 5, Year = 2013, Usage = 110 };
            var jun = new UtilityUsage { Month = 6, Year = 2013, Usage = 125 };
            var jul = new UtilityUsage { Month = 7, Year = 2013, Usage = 175 };
            var aug = new UtilityUsage { Month = 8, Year = 2013, Usage = 200 };
            var sep = new UtilityUsage { Month = 9, Year = 2013, Usage = 175 };
            var oct = new UtilityUsage { Month = 10, Year = 2013, Usage = 160 };
            var nov = new UtilityUsage { Month = 11, Year = 2013, Usage = 140 };
            var dec = new UtilityUsage { Month = 12, Year = 2013, Usage = 130 };

            var jan2 = new UtilityUsage { Month = 1, Year = 2013, Usage = 60 };
            var feb2 = new UtilityUsage { Month = 2, Year = 2013, Usage = 55 };
            var mar2 = new UtilityUsage { Month = 3, Year = 2013, Usage = 70 };
            var apr2 = new UtilityUsage { Month = 4, Year = 2013, Usage = 58 };
            var may2 = new UtilityUsage { Month = 5, Year = 2013, Usage = 72 };
            var jun2 = new UtilityUsage { Month = 6, Year = 2013, Usage = 82 };
            var jul2 = new UtilityUsage { Month = 7, Year = 2013, Usage = 85 };
            var aug2 = new UtilityUsage { Month = 8, Year = 2013, Usage = 81 };
            var sep2 = new UtilityUsage { Month = 9, Year = 2013, Usage = 70 };
            var oct2 = new UtilityUsage { Month = 10, Year = 2013, Usage = 69 };
            var nov2 = new UtilityUsage { Month = 11, Year = 2013, Usage = 62 };
            var dec2 = new UtilityUsage { Month = 12, Year = 2013, Usage = 70 };

            return new GetEnergyUsageResponse
            {
                UtilityType = accountNumber == "1197015532" ? "Electric" : "Gas",
                EnergyUsage = accountNumber == "1197015532" ? new[] { jan, feb, mar, apr, may, jun, jul, aug, sep, oct, nov, dec } : new[] { jan2, feb2, mar2, apr2, may2, jun2, jul2, aug2, sep2, oct2, nov2, dec2 }
            };
        }

        #endregion

        #region Invoices

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<GetInvoicesResponse> GetInvoices()
        {
            return new GetInvoicesResponse
            {
                Invoices = new Table<Models.Account.Invoice>
                {
                    ColumnList = typeof(StreamEnergy.MyStream.Models.Account.Invoice).BuildTableSchema(database.GetItem("/sitecore/content/Data/Components/Account/Overview/My Invoices")),
                    Values = from account in currentUser.Accounts = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts)
                             where account.Invoices != null
                             from invoice in account.Invoices
                             select CreateViewInvoice(account, invoice)
                }
            };
        }

        private static Models.Account.Invoice CreateViewInvoice(Account account, DomainModels.Accounts.Invoice invoice)
        {
            var result = new StreamEnergy.MyStream.Models.Account.Invoice
            {
                AccountNumber = account.AccountNumber,
                ServiceType = account.AccountType,
                InvoiceNumber = invoice.InvoiceNumber,
                InvoiceAmount = invoice.InvoiceAmount,
                DueDate = invoice.DueDate,
                CanRequestExtension = account.GetCapability<InvoiceExtensionAccountCapability>().CanRequestExtension,
            };
            
            if (invoice.PdfAvailable)
            {
                result.Actions.Add("viewPdf", "/api/account/invoicePdf?account=" + account.AccountNumber + "&invoice=" + invoice.InvoiceNumber);
            }

            return result;
        }

        [Authorize]
        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<HttpResponseMessage> InvoicePdf(string account, string invoice)
        {
            currentUser.Accounts = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts);

            var chosenAccount = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == account);
            var chosenInvoice = chosenAccount.Invoices.FirstOrDefault(inv => inv.InvoiceNumber == invoice);
            var url = await accountService.GetInvoicePdf(chosenAccount, chosenInvoice);

            HttpClient client = new HttpClient();
            var response = await client.GetAsync(url);

            HttpResponseMessage result = new HttpResponseMessage(HttpStatusCode.OK);
            result.Content = new StreamContent(await response.Content.ReadAsStreamAsync())
            {
                Headers = 
                {
                    ContentType = response.Content.Headers.ContentType,
                    ContentDisposition = new System.Net.Http.Headers.ContentDispositionHeaderValue("attachment")
                    {
                        FileName = "invoice" + invoice + ".pdf"
                    }
                }
            };

            return result;                
        }

        #endregion

        #region Make a Payment section

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<GetAccountBalancesTableResponse> GetAccountBalancesTable()
        {
            currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            var acocuntInvoices = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts);
            
            return new GetAccountBalancesTableResponse
            {
                Accounts = new Table<AccountToPay>
                {
                    ColumnList = typeof(AccountToPay).BuildTableSchema(database.GetItem("/sitecore/content/Data/Components/Account/Overview/Make a Payment")),
                    Values = from account in currentUser.Accounts
                             let invoice = acocuntInvoices.First(t => t.AccountNumber == account.AccountNumber && t.Invoices != null).Invoices.LastOrDefault()
                             select CreateViewAccountBalances(account, invoice)
                }
            };
        }

        [HttpPost]
        public async Task<MakeMultiplePaymentsResponse> MakeMultiplePayments(MakeMultiplePaymentsRequest request)
        {
            var validationItem = database.GetItem("/sitecore/content/Data/Components/Account/Overview/Make a Payment");
            if (!ModelState.IsValid)
            {
                return new MakeMultiplePaymentsResponse
                {
                    Validations = TranslatedValidationResult.Translate(ModelState, validationItem),
                };
            }
            currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId, currentUser.Accounts);
            var accounts = (from paymentSettings in request.Accounts
                            join account in currentUser.Accounts on paymentSettings.AccountNumber equals account.AccountNumber
                            select new { account, paymentMethod = paymentSettings.PaymentAccount, paymentAmount = paymentSettings.PaymentAmount, securityCode = paymentSettings.SecurityCode }).ToArray();

            if (!request.OverrideWarnings.Contains("Overpayment"))
            {
                foreach (var entry in accounts)
                {
                    if (entry.account.Balance.Balance * 3 <= entry.paymentAmount)
                    {
                        return new MakeMultiplePaymentsResponse
                        {
                            Validations = Enumerable.Empty<TranslatedValidationResult>(),
                            BlockingAlertType = "Overpayment",
                        };
                    }

                }
            }

            var paymentRecords = (from entry in accounts
                                  select new DomainModels.Payments.PaymentRecord
                                  {
                                      AccountNumber = entry.account.AccountNumber,
                                      Amount = entry.paymentAmount,
                                      Method = entry.paymentMethod,
                                      Date = request.PaymentDate,
                                      SecurityCode = entry.securityCode
                                  }).ToArray();
            if (!request.OverrideWarnings.Contains("Duplicate"))
            {
                bool isDuplicate = await paymentService.DetectDuplicatePayments(paymentRecords);
                if (isDuplicate)
                {
                    return new MakeMultiplePaymentsResponse
                    {
                        Validations = Enumerable.Empty<TranslatedValidationResult>(),
                        BlockingAlertType = "Duplicate",
                    };
                }
            }

            var temp = accounts
                .Select(entry => new 
                { 
                    entry.account,
                    entry.paymentAmount,
                    task = paymentService.OneTimePayment(request.PaymentDate, entry.paymentAmount, entry.account.Details.ContactInfo.Name.First + " " + entry.account.Details.ContactInfo.Name.Last, entry.account, entry.paymentMethod, entry.securityCode) 
                }).ToArray();
            await Task.WhenAll(temp.Select(e => e.task));
            await paymentService.RecordForDuplicatePayments((from entry in paymentRecords
                                                             join acct in temp on entry.AccountNumber equals acct.account.AccountNumber
                                                             where acct.task.Result.ConfirmationNumber != null
                                                             select entry).ToArray());

            return new MakeMultiplePaymentsResponse
            {
                Validations = Enumerable.Empty<TranslatedValidationResult>(),
                Confirmations = temp.Select(entry => new PaymentConfirmation
                {
                    AccountNumber = entry.account.AccountNumber,
                    PaymentConfirmationNumber = entry.task.Result.ConfirmationNumber,
                    ConvenienceFee = entry.task.Result.ConvenienceFee,
                }).ToArray()
            };
        }

        #endregion

        #region Payment History

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<GetPaymentsResponse> GetPayments()
        {
            return new GetPaymentsResponse
            {
                Payments = new Table<Models.Account.Payment>
                {
                    ColumnList = typeof(StreamEnergy.MyStream.Models.Account.Payment).BuildTableSchema(database.GetItem("/sitecore/content/Data/Components/Account/Overview/My Payments")),
                    Values = from account in currentUser.Accounts = await paymentService.PaymentHistory(currentUser.StreamConnectCustomerId)
                             where account.PaymentHistory != null
                             from payment in account.PaymentHistory
                             select new StreamEnergy.MyStream.Models.Account.Payment
                             {
                                AccountNumber = account.AccountNumber,
                                ServiceType = account.AccountType,
                                PaymentMadeBy = payment.CustomerName,
                                PaymentAmount = payment.PaymentAmount.ToString("0.00"),
                                PaymentDate = payment.PaidDate,
                                PaymentID = payment.PaymentId,
                                Actions = 
                                {
                                    { "showDetails", "" }
                                }
                             }
                }
            };
        }

        #endregion

        #region Utility Services

        [HttpPost]
        public async Task<GetUtilityPlanResponse> GetUtilityPlan(GetUtiltiyPlansRequest request)
        {
            var accountNumber = request.AccountNumber;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            var accountDetails = await accountService.GetAccountDetails(account, false);
            var renewalEligibility = await accountService.CheckRenewalEligibility(account, account.SubAccounts.First());

            return new GetUtilityPlanResponse
            {
                AccountId = account.StreamConnectAccountId,
                SubAccounts = account.SubAccounts,
                RenewalCapability = account.GetCapability<RenewalAccountCapability>()
            };
        }

        #endregion

        #region Online Account Information

        [HttpGet]
        public async Task<GetOnlineAccountResponse> GetOnlineAccount()
        {
            var username = User.Identity.Name;
            var profile = UserProfile.Locate(container, username);

            var email = new DomainModels.Email();
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");

            var customer = this.currentUser.Customer ?? await accountService.GetCustomerByCustomerId(profile.GlobalCustomerId);
            email.Address = customer.EmailAddress;
            
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
                    from challenge in profile.ChallengeQuestions.GroupBy(c => c.QuestionKey).Select(grp => grp.First()).ToDictionary(c => c.QuestionKey, c => (string)null) ?? new Dictionary<Guid, string>()
                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                    select new AnsweredSecurityQuestion
                    {
                        SelectedQuestion = new SecurityQuestion
                        {
                            Id = challenge.Key,
                            Text = questionItem != null ? questionItem["Question"] : ""
                        }
                    },
            };
        }

        [HttpPost]
        public async Task<HttpResponseMessage> UpdateOnlineAccount(UpdateOnlineAccountRequest request)
        {
            var currentUser = Membership.GetUser(User.Identity.Name);
            var currentUsername = currentUser.UserName;
            var newUsername = request.Username;
            var newUsernameWithPrefix = domain.AccountPrefix + request.Username;

            request.Username = domain.AccountPrefix + request.Username;
            if (currentUsername == request.Username)
            { 
                request.Username = null;
            }

            var validations = validation.CompleteValidate(request);

            if (!validations.Any())
            {
                var response = Request.CreateResponse(new UpdateOnlineAccountResponse
                {
                    Success = true
                });

                // update the username
                if (!string.IsNullOrEmpty(request.Username))
                {
                    if (authentication.ChangeUsername(currentUsername, request.Username))
                    {
                        // update the cookie
                        authentication.AddAuthenticationCookie(response, newUsername);

                        var newIdentity = new System.Security.Principal.GenericIdentity(request.Username);
                        var newPrincipal = new System.Security.Principal.GenericPrincipal(newIdentity, new string[] { });
                        User = newPrincipal;
                    }
                }

                // update the email address (and/or username) with Stream Connect
                var customer = this.currentUser.Customer = this.currentUser.Customer ?? await accountService.GetCustomerByCustomerId(this.currentUser.StreamConnectCustomerId);
                if (customer.EmailAddress != request.Email.Address || !string.IsNullOrEmpty(request.Username))
                {
                    customer.Username = request.Username ?? newUsernameWithPrefix;
                    customer.EmailAddress = request.Email.Address;
                    await accountService.UpdateCustomer(customer);
                }                

                // update the password if it has been set
                if (!string.IsNullOrEmpty(request.CurrentPassword))
                {
                    currentUser.ChangePassword(request.CurrentPassword, request.Password);
                }

                // update the challeges
                if (request.Challenges != null && request.Challenges.Any(c => !string.IsNullOrEmpty(c.Answer)))
                {
                    var profile = UserProfile.Locate(container, newUsernameWithPrefix);
                    
                    profile.ChallengeQuestions = (from entry in request.Challenges
                                                  join existing in profile.ChallengeQuestions on entry.SelectedQuestion.Id equals existing.QuestionKey into existing
                                                  let existingQuestion = existing.FirstOrDefault()
                                                  let useExistingQuestion = existingQuestion != null && string.IsNullOrEmpty(entry.Answer)
                                                  select useExistingQuestion ? existingQuestion : ChallengeResponse.Create(entry.SelectedQuestion.Id, entry.Answer)).ToArray();

                    profile.Save();
                }

                return response;
            }
            else 
            {
                var response = Request.CreateResponse(new UpdateOnlineAccountResponse
                {
                    Success = false,
                    Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("My Online Account Information"))
                });
                return response;
            }
        }

        #endregion

        #region Account Selector

        [HttpGet]
        public async Task<IEnumerable<AccountSummary>> GetAccounts()
        {
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var summary = currentUser.Accounts.Select(acct => new AccountSummary(acct));

            return summary;
        }

        #endregion

        #region Account Information

        [HttpPost]
        public async Task<GetAccountInformationResponse> GetAccountInformation(GetAccountInformationRequest request)
        {
            var serviceAddress = new DomainModels.Address();
            bool sameAsService = false;

            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            var accountDetails = await accountService.GetAccountDetails(account, false);
            var mobilePhone = account.Details.ContactInfo.Phone.OfType<DomainModels.TypedPhone>().Where(p => p.Category == DomainModels.PhoneCategory.Mobile).FirstOrDefault();
            var homePhone = account.Details.ContactInfo.Phone.OfType<DomainModels.TypedPhone>().Where(p => p.Category == DomainModels.PhoneCategory.Home).FirstOrDefault();

            if (account.SubAccounts != null && (account.SubAccounts[0]) != null && (account.SubAccounts[0]).SubAccountType == "GeorgiaGas")
            {
                serviceAddress = ((StreamEnergy.DomainModels.Accounts.GeorgiaGasAccount)(account.SubAccounts[0])).ServiceAddress;
            }
            
            if (serviceAddress.Equals(account.Details.BillingAddress))
            {
                sameAsService = true;
            }

            return new GetAccountInformationResponse
            {
                CustomerName = account.Details.ContactInfo.Name,
                MobilePhone = mobilePhone,
                HomePhone = homePhone,
                Email = account.Details.ContactInfo.Email,
                ServiceAddress = serviceAddress,
                SameAsService = sameAsService,
                BillingAddress = account.Details.BillingAddress
            };
        }

        [HttpPost]
        public async Task<UpdateAccountInformationResponse> UpdateAccountInformation(UpdateAccountInformationRequest request)
        {
            bool success = false;
            var validations = validation.CompleteValidate(request);

            if (!validations.Any())
            {
                var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
                account.Details.ContactInfo.Phone = new[] 
                { 
                    new StreamEnergy.DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = request.HomePhone.Number },
                    new StreamEnergy.DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Mobile, Number = request.MobilePhone.Number },
                };
                account.Details.ContactInfo.Email = new DomainModels.Email { Address = request.Email.Address };
                account.Details.BillingAddress = request.BillingAddress;
                success = await accountService.SetAccountDetails(account, account.Details);
            }

            return new UpdateAccountInformationResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Update Account Information"))
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
        public async Task<GetEnrolledAccountsResponse> GetEnrolledAccounts()
        {
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var summary = currentUser.Accounts.Select(acct => new AccountSummary(acct));

            return new GetEnrolledAccountsResponse
            {
                EnrolledAccounts = summary
            };
        }

        [HttpPost]
        public async Task<AddNewAccountResponse> AddNewAccount(AddNewAccountRequest request)
        {
            bool success = false;
            var validations = validation.CompleteValidate(request);

            // make sure the account isn't already associated
            var existingAccount = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            if (existingAccount != null)
            {
                var val = new ValidationResult("Account Already Associated", new[] { "AccountNumber" });
                validations = validations.Concat(new[] { val });
            }
            
            // locked out after 5 tries
            var value = (int?) await redis.StringGetAsync(redisPrefix + request.AccountNumber);
            if (value != null && value >= 5)
            {
                var val = new ValidationResult("Account Locked", new[] { "AccountNumber" });
                validations = validations.Concat(new[] { val });
            }

            var internalAccount = await accountService.GetAccountDetails(request.AccountNumber);
            if (internalAccount != null && internalAccount.Details.SsnLastFour != request.SsnLast4)
            {
                internalAccount = null;
                await redis.StringIncrementAsync(redisPrefix + request.AccountNumber);
                await redis.KeyExpireAsync(redisPrefix + request.AccountNumber, TimeSpan.FromMinutes(30));
            }

            if (!validations.Any())
            {
                var account = await accountService.AssociateAccount(currentUser.StreamConnectCustomerId, request.AccountNumber, request.SsnLast4, request.AccountNickname);
                if (account != null)
                {
                    success = true;
                }
            }

            return new AddNewAccountResponse
            {
                Success = success,
                Validations = TranslatedValidationResult.Translate(validations, GetAuthItem("Add New Account"))
            };
        }

        [HttpPost]
        public async Task<RemoveAccountResponse> RemoveEnrolledAccount(RemoveAccountRequest request)
        {
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.StreamConnectAccountId == request.AccountId);

            bool response = await accountService.DisassociateAccount(account);

            return new RemoveAccountResponse
            {
                Success = response
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

        #region One-time Payment

        [HttpPost]
        public async Task<FindAccountForOneTimePaymentResponse> FindAccountForOneTimePayment(FindAccountForOneTimePaymentRequest request)
        {
            var details = await accountService.GetAccountDetails(request.AccountNumber);
            if (details == null) 
            {
                return new FindAccountForOneTimePaymentResponse
                {
                    Success = false
                };
            }

            return new FindAccountForOneTimePaymentResponse
                {
                    Success = true,
                    Account = new AccountToPay
                    {
                        AccountNumber = details.AccountNumber,
                        CanMakeOneTimePayment = true,
                        AmountDue = details.Balance.Balance,
                        AvailablePaymentMethods = details.GetCapability<PaymentMethodAccountCapability>().AvailablePaymentMethods.ToArray()
                    }
                };
        }

        [HttpPost]
        public async Task<MakeOneTimePaymentResponse> MakeOneTimePayment(MakeOneTimePaymentRequest request)
        {
            var validationItem = database.GetItem("/sitecore/content/Data/Components/Account/Overview/Make a Payment");
            if (!ModelState.IsValid)
            {
                return new MakeOneTimePaymentResponse
                {
                    Validations = TranslatedValidationResult.Translate(ModelState, validationItem),
                };
            }
            Account account = await accountService.GetAccountDetails(accountNumber: request.AccountNumber);

            Dictionary<Account, decimal> paymentAmounts;
            
            if (account.Balance.Balance * 3 <= request.TotalPaymentAmount && !request.OverrideWarnings.Contains("Overpayment"))
            {
                return new MakeOneTimePaymentResponse
                {
                    Validations = Enumerable.Empty<TranslatedValidationResult>(),
                    BlockingAlertType = "Overpayment",
                };
            }

            paymentAmounts = new Dictionary<Account, decimal> { { account, request.TotalPaymentAmount } };

            var paymentRecords = new[] {
                new DomainModels.Payments.PaymentRecord
                                  {
                                      AccountNumber = request.AccountNumber,
                                      Amount = request.TotalPaymentAmount,
                                      Method = request.PaymentAccount,
                                      Date = DateTime.Today,
                                  }
            };
            if (!request.OverrideWarnings.Contains("Duplicate"))
            {
                bool isDuplicate = await paymentService.DetectDuplicatePayments(paymentRecords);
                if (isDuplicate)
                {
                    return new MakeOneTimePaymentResponse
                    {
                        Validations = Enumerable.Empty<TranslatedValidationResult>(),
                        BlockingAlertType = "Duplicate",
                    };
                }
            }

            var confirmation = await paymentService.OneTimePayment(DateTime.Today, request.TotalPaymentAmount, account.AccountNumber, request.CustomerName, account.SystemOfRecord, request.PaymentAccount);

            return new MakeOneTimePaymentResponse
            {
                Validations = Enumerable.Empty<TranslatedValidationResult>(),
                Confirmation = new PaymentConfirmation
                {
                    AccountNumber = account.AccountNumber,
                    PaymentConfirmationNumber = confirmation.ConfirmationNumber
                }
            };
        }

        #endregion

        #region Saved Payment Accounts

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public async Task<IHttpActionResult> GetSavedPaymentMethods(bool includeAutoPayFlag = false)
        {
            if (includeAutoPayFlag)
            {
                return Ok(await paymentService.GetSavedPaymentMethods(currentUser.StreamConnectCustomerId));
            }
            else
            {
                return Ok(from record in await paymentService.GetSavedPaymentMethods(currentUser.StreamConnectCustomerId)
                          select record.PaymentMethod);
            }
        }

        [HttpPost]
        public async Task<AddPaymentAccountResponse> AddPaymentAccount(AddPaymentAccountRequest request)
        {
            if (!ModelState.IsValid)
            {
                Sitecore.Data.Items.Item validationItem;
                if (request.PaymentAccount is DomainModels.Payments.TokenizedBank)
                    validationItem = database.GetItem("/sitecore/content/Data/Components/Account/Payment Accounts/Add Bank Account");
                else
                    validationItem = database.GetItem("/sitecore/content/Data/Components/Account/Payment Accounts/Add Credit Card");

                return new AddPaymentAccountResponse
                {
                    Validations = TranslatedValidationResult.Translate(ModelState, validationItem),
                };
            }

            await paymentService.SavePaymentMethod(currentUser.StreamConnectCustomerId, request.PaymentAccount, request.Nickname);

            return new AddPaymentAccountResponse
            {
                Validations = Enumerable.Empty<TranslatedValidationResult>(),
                RedirectUri = LinkManager.GetItemUrl(Sitecore.Context.Database.GetItem(new Sitecore.Data.ID(new Guid("{4927A836-7309-4D0C-898B-A06503C37997}")))) + "?success=1234",
            };
        }

        [HttpPost]
        public async Task<DeletePaymentAccountResponse> DeletePaymentAccount(DeletePaymentAccountRequest request)
        {
            if (!ModelState.IsValid)
            {
                var validationItem = database.GetItem("/sitecore/content/Data/Components/Account/Payment Accounts/Add Bank Account");

                return new DeletePaymentAccountResponse
                {
                    Validations = TranslatedValidationResult.Translate(ModelState, validationItem),
                };
            }

            await paymentService.DeletePaymentMethod(currentUser.StreamConnectCustomerId, request.PaymentAccountId);

            return new DeletePaymentAccountResponse
            {
                Validations = Enumerable.Empty<TranslatedValidationResult>(),
            };
        }

        #endregion

        #region AutoPay

        [HttpPost]
        public async Task<GetAutoPayStatusResponse> GetAutoPayStatus(GetAutoPayStatusRequest request)
        {
            currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            var autoPayStatus = await paymentService.GetAutoPayStatus(account);
            if (autoPayStatus.PaymentMethodId == Guid.Empty) 
            { 
                autoPayStatus.PaymentMethodId = null; 
            }

            return new GetAutoPayStatusResponse
            {
                AccountNumber = request.AccountNumber,
                AutoPay = autoPayStatus
            };
        }

        [HttpPost]
        public async Task<SetAutoPayResponse> SetAutoPay(SetAutoPayRequest request)
        {
            var account = currentUser.Accounts.FirstOrDefault(acct => acct.AccountNumber == request.AccountNumber);
            return new SetAutoPayResponse
            {
                IsSuccess = await paymentService.SetAutoPayStatus(account, new DomainModels.Payments.AutoPaySetting
                    {
                        IsEnabled = request.AutoPay.IsEnabled,
                        PaymentMethodId = request.AutoPay.IsEnabled ? request.AutoPay.PaymentMethodId : Guid.Empty
                    },
                    request.SecurityCode)
            };
        }
        
        #endregion

        #region Renewal

        [HttpPost]
        public async Task<SetupRenewalResponse> SetupRenewal(SetupRenewalRequest request)
        {
            if (currentUser.Accounts != null)
            {
                currentUser.Accounts = await accountService.GetAccounts(currentUser.StreamConnectCustomerId);
            }
            var target = currentUser.Accounts.First(acct => acct.StreamConnectAccountId == request.AccountId);

            await accountService.GetAccountDetails(target);
            var subAccount = target.SubAccounts.First(acct => acct.Id == request.SubAccountId);

            await enrollmentController.Initialize(null);

            return new SetupRenewalResponse
            {
                IsSuccess = await enrollmentController.SetupRenewal(target, subAccount)
            };
        }

        #endregion

        private Sitecore.Data.Items.Item GetAuthItem(string childItem)
        {
            return item.Children[childItem];
        }

    }
}