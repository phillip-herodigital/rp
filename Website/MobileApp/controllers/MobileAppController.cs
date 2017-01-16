using Microsoft.Practices.Unity;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.MobileApp.models;
using StreamEnergy.MyStream.Models.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;

namespace StreamEnergy.MyStream.MobileApp.controllers
{
    public class MobileAppController : ApiController, IRequiresSessionState
    {

        private readonly Sitecore.Data.Items.Item item;
        private readonly IUnityContainer container;
        private readonly DomainModels.Accounts.IAccountService accountService;
        private readonly DomainModels.Payments.IPaymentService paymentService;
        private readonly Sitecore.Security.Domains.Domain domain;
        private readonly Sitecore.Data.Database database;
        private readonly StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication;
        private readonly ICurrentUser currentUser;

        private const string ELECTRICITY = "electricity";
        private const string GAS = "gas";
        private const string EMAIL = "Email";
        private const string DIRECT_MAIL = "DirectMail";

        public MobileAppController(IUnityContainer container, HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, DomainModels.Payments.IPaymentService paymentService, StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication, ICurrentUser currentUser)
        {
            this.container = container;
            this.accountService = accountService;
            this.paymentService = paymentService;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Account/Profile");
            this.authentication = authentication;
            this.currentUser = currentUser;
        }

        [HttpGet]
        public async Task<MobileAppResponse> LoadAppData()
        {
            if (Sitecore.Context.User == null)
            {
                return null;
            }

            var profile = UserProfile.Locate(container, User.Identity.Name);
            var questionsRoot = database.GetItem("/sitecore/content/Data/Taxonomy/Security Questions");

            currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            currentUser.Customer = await accountService.GetCustomerByCustomerId(currentUser.StreamConnectCustomerId);

            var accountInvoices = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts);
            var userPaymentMethods = await paymentService.GetSavedPaymentMethods(currentUser.StreamConnectCustomerId);

            return new MobileAppResponse
            {
                User = new MobileAppUser
                {
                    Name = Sitecore.Context.User.LocalName,
                    UserName = Sitecore.Context.GetUserName(),
                    Email = currentUser.Customer.EmailAddress,
                    PaymentMethods = userPaymentMethods,
                    AvailableSecurityQuestions =
                    from questionItem in (questionsRoot != null ? questionsRoot.Children : Enumerable.Empty<Sitecore.Data.Items.Item>())
                    select new StreamEnergy.MyStream.Models.Authentication.SecurityQuestion
                    {
                        Id = questionItem.ID.Guid,
                        Text = questionItem["Question"]
                    },
                    Challenges =
                    from challenge in (profile.ChallengeQuestions ?? new ChallengeResponse[] { }).GroupBy(c => c.QuestionKey).Select(grp => grp.First()).ToDictionary(c => c.QuestionKey, c => (string)null) ?? new Dictionary<Guid, string>()
                    let questionItem = database.GetItem(new Sitecore.Data.ID(challenge.Key))
                    select new StreamEnergy.MyStream.Models.Authentication.AnsweredSecurityQuestion
                    {
                        SelectedQuestion = new StreamEnergy.MyStream.Models.Authentication.SecurityQuestion
                        {
                            Id = challenge.Key,
                            Text = questionItem != null ? questionItem["Question"] : ""
                        }
                    }
                },

                Accounts = from account in currentUser.Accounts
                           let invoiceAcct = accountInvoices.FirstOrDefault(t => t.AccountNumber == account.AccountNumber && t.Invoices != null)
                           select FetchAccountData(account, invoiceAcct != null ? invoiceAcct.Invoices.OrderByDescending(i => i.DueDate).FirstOrDefault() : null)
            };
        }

        [HttpPut]
        public async Task<MobileAppResponse> UpdateAutoPay(string AccountNumber, bool enabled, string sPaymentMethodId)
        {
            if (currentUser.Accounts == null)
            {
                currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            }

            var account = currentUser.Accounts.Where(acct => acct.AccountNumber == AccountNumber).FirstOrDefault();

            if (account != null)
            {
                if (enabled)
                {
                    account.AutoPay.IsEnabled = true;
                    account.AutoPay.PaymentMethodId = new Guid(sPaymentMethodId);
                }
                else
                {
                    account.AutoPay.IsEnabled = false;
                    account.AutoPay.PaymentMethodId = null;
                }
                await accountService.SetAccountDetails(account, account.Details);
            }

            return await LoadAppData();
        }

        [HttpPut]
        public async Task<MobileAppResponse> UpdatePaperlessBilling(string AccountNumber, bool enabled)
        {
            if (currentUser.Accounts == null)
            {
                currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            }

            var account = currentUser.Accounts.Where(acct => acct.AccountNumber == AccountNumber).FirstOrDefault();

            if (account != null)
            {
                if (enabled)
                {
                    account.Details.BillingDeliveryPreference = EMAIL;
                }
                else
                {
                    account.Details.BillingDeliveryPreference = DIRECT_MAIL;
                }

                await accountService.SetAccountDetails(account, account.Details);
            }

            return await LoadAppData();
        }

        private MobileAppAccount FetchAccountData(Account account, DomainModels.Accounts.Invoice invoice)
        {
            MobileAppAccount result  = new MobileAppAccount
            {
                AccountNumber = account.AccountNumber,
                AmountDue = account.Balance.Balance,
                DueDate = account.Balance.DueDate,
                AccountType = account.AccountType,
                SystemOfRecord = account.SystemOfRecord,
                UtilityProvider = account.GetCapability<ExternalPaymentAccountCapability>().UtilityProvider,
                HasAutoPay = account.AutoPay != null ? account.AutoPay.IsEnabled : false,
                IsPaperless = account.Details.BillingDeliveryPreference == EMAIL,
                BillingDeliveryPreference = account.Details.BillingDeliveryPreference,
                CanMakeOneTimePayment = account.GetCapability<PaymentSchedulingAccountCapability>().CanMakeOneTimePayment,
                AvailablePaymentMethods = account.GetCapability<PaymentMethodAccountCapability>().AvailablePaymentMethods.ToArray(),
            };

            if (account.SubAccounts == null || account.SubAccounts.Length <= 0)
            {
                return result;
            }

            if (account.AccountType.Equals("Mobile"))
            {

                MobileAccount mobileAccount = (MobileAccount)account.SubAccounts.First();

                accountService.GetAccountUsageDetails(account, mobileAccount.LastBillDate, mobileAccount.NextBillDate, true);

                List<MobileAppPhoneLine> phoneLines = new List<MobileAppPhoneLine>();

                foreach (ISubAccount subAccount in account.SubAccounts)
                {
                    MobileAppPhoneLine phoneLine = new MobileAppPhoneLine();

                    phoneLine.PhoneNumber = ((MobileAccount)subAccount).PhoneNumber;

                    phoneLine.DeviceUsage = account.SubAccounts != null && account.SubAccounts.Count() > 0 ? from device in account.SubAccounts.Cast<MobileAccount>()
                                                                                                             let usage = (MobileAccountUsage)(account.Usage != null ? account.Usage.FirstOrDefault(u => ((MobileAccount)u.Key).PhoneNumber.Trim() == device.PhoneNumber.Trim()).Value : null)
                                                                                                             select new MobileUsage()
                                                                                                             {
                                                                                                                 Name = device.EquipmentId,
                                                                                                                 Number = device.PhoneNumber,
                                                                                                                 Id = device.Id,
                                                                                                                 DataUsage = usage != null ? usage.DataUsage : (decimal?)null,
                                                                                                                 DataLimit = usage != null ? usage.DataLimit : null,
                                                                                                                 MessagesUsage = usage != null ? usage.MessagesUsage : (decimal?)null,
                                                                                                                 MinutesUsage = usage != null ? usage.MinutesUsage : (decimal?)null,
                                                                                                             } : null;

                    phoneLines.Add(phoneLine);
                }
                result.MobileAppPhoneLines = phoneLines.ToArray();
            }
            else
            {
                // TODO: refactory the interface instead?
                foreach (ISubAccount subAccount in account.SubAccounts)
                {
                    if (subAccount is DCElectricityAccount)
                    {
                        result.ServiceAddress = ((DCElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((DCElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((DCElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((DCElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                    else if (subAccount is GeorgiaGasAccount)
                    {
                        result.ServiceAddress = ((GeorgiaGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((GeorgiaGasAccount)subAccount).ProductName;
                        result.PlanRate = ((GeorgiaGasAccount)subAccount).Rate;
                        result.PlanRateType = ((GeorgiaGasAccount)subAccount).RateType.ToString();
                        result.UtilityType = GAS;
                    }
                    else if (subAccount is MarylandElectricityAccount)
                    {
                        result.ServiceAddress = ((MarylandElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((MarylandElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((MarylandElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((MarylandElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                    else if (subAccount is MarylandGasAccount)
                    {
                        result.ServiceAddress = ((MarylandGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((MarylandGasAccount)subAccount).ProductName;
                        result.PlanRate = ((MarylandGasAccount)subAccount).Rate;
                        result.PlanRateType = ((MarylandGasAccount)subAccount).RateType.ToString();
                        result.UtilityType = GAS;
                    }
                    else if (subAccount is NewJerseyElectricityAccount)
                    {
                        result.ServiceAddress = ((NewJerseyElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((NewJerseyElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((NewJerseyElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((NewJerseyElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                    else if (subAccount is NewJerseyGasAccount)
                    {
                        result.ServiceAddress = ((NewJerseyGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((NewJerseyGasAccount)subAccount).ProductName;
                        result.PlanRate = ((NewJerseyGasAccount)subAccount).Rate;
                        result.PlanRateType = ((NewJerseyGasAccount)subAccount).RateType.ToString();
                        result.UtilityType = GAS;
                    }
                    else if (subAccount is NewYorkElectricityAccount)
                    {
                        result.ServiceAddress = ((NewYorkElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((NewYorkElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((NewYorkElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((NewYorkElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                    else if (subAccount is NewYorkGasAccount)
                    {
                        result.ServiceAddress = ((NewYorkGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((NewYorkGasAccount)subAccount).ProductName;
                        result.PlanRate = ((NewYorkGasAccount)subAccount).Rate;
                        result.PlanRateType = ((NewYorkGasAccount)subAccount).RateType.ToString();
                        result.UtilityType = GAS;
                    }
                    else if (subAccount is PennsylvaniaElectricityAccount)
                    {
                        result.ServiceAddress = ((PennsylvaniaElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((PennsylvaniaElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((PennsylvaniaElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((PennsylvaniaElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                    else if (subAccount is PennsylvaniaGasAccount)
                    {
                        result.ServiceAddress = ((PennsylvaniaGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((PennsylvaniaGasAccount)subAccount).ProductName;
                        result.PlanRate = ((PennsylvaniaGasAccount)subAccount).Rate;
                        result.PlanRateType = ((PennsylvaniaGasAccount)subAccount).RateType.ToString();
                        result.UtilityType = GAS;
                    }
                    else if (subAccount is TexasElectricityAccount)
                    {
                        result.ServiceAddress = ((TexasElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((TexasElectricityAccount)subAccount).ProductName;
                        result.PlanRate = ((TexasElectricityAccount)subAccount).Rate;
                        result.PlanRateType = ((TexasElectricityAccount)subAccount).RateType.ToString();
                        result.UtilityType = ELECTRICITY;
                    }
                }
            }

            return result;
        }

    }
}
