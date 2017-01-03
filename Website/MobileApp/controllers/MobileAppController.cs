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
       // private readonly IValidationService validation;
        private readonly StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication;
        private readonly ICurrentUser currentUser;
        //private readonly EnrollmentController enrollmentController;
        //private readonly IEnrollmentService enrollmentService;
        //private readonly IDatabase redis;
        private const string redisPrefix = "AddNewAccount_FindAccount_";

        public MobileAppController(IUnityContainer container, HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, DomainModels.Payments.IPaymentService paymentService, StreamEnergy.MyStream.Controllers.ApiControllers.AuthenticationController authentication, ICurrentUser currentUser)
        {
            this.container = container;
            this.accountService = accountService;
            this.paymentService = paymentService;
            this.domain = Sitecore.Context.Site.Domain;
            this.database = Sitecore.Context.Database;
            this.item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Components/Account/Profile");
            //this.validation = validation;
            this.authentication = authentication;
            this.currentUser = currentUser;
            //this.enrollmentController = enrollmentController;
            //this.redis = redis;
            //this.enrollmentService = enrollmentService;
        }

        [HttpGet]
        public async Task<MobileAppResponse> LoadAppData()
        {
            if (Sitecore.Context.User == null)
            {
                return null;
            }

            currentUser.Accounts = await accountService.GetAccountBalances(currentUser.StreamConnectCustomerId);
            var accountInvoices = await accountService.GetInvoices(currentUser.StreamConnectCustomerId, currentUser.Accounts);

            return new MobileAppResponse
            {
                User = new MobileAppUser
                {
                    Name = Sitecore.Context.User.LocalName,
                    UserName = Sitecore.Context.GetUserName()
                },

                Accounts = from account in currentUser.Accounts
                           let invoiceAcct = accountInvoices.FirstOrDefault(t => t.AccountNumber == account.AccountNumber && t.Invoices != null)
                           select FetchAccountData(account, invoiceAcct != null ? invoiceAcct.Invoices.OrderByDescending(i => i.DueDate).FirstOrDefault() : null)
            };
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
                CanMakeOneTimePayment = account.GetCapability<PaymentSchedulingAccountCapability>().CanMakeOneTimePayment,
                AvailablePaymentMethods = account.GetCapability<PaymentMethodAccountCapability>().AvailablePaymentMethods.ToArray(),
            };

            if (account.SubAccounts == null || account.SubAccounts.Length <= 0)
            {
                return result;
            }

            if (account.AccountType == "Mobile")
            {

                MobileAccount mobileAccount = (MobileAccount)account.SubAccounts.First();

                accountService.GetAccountUsageDetails(account, mobileAccount.LastBillDate, mobileAccount.NextBillDate, true);

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
                }
            }
            else
            {
                foreach (ISubAccount subAccount in account.SubAccounts)
                {
                    if (subAccount is GeorgiaGasAccount)
                    {
                        result.ServiceAddress = ((GeorgiaGasAccount)subAccount).ServiceAddress;
                        result.PlanName = ((GeorgiaGasAccount)subAccount).ProductName;
                    }
                    else if (subAccount is TexasElectricityAccount)
                    {
                        result.ServiceAddress = ((TexasElectricityAccount)subAccount).ServiceAddress;
                        result.PlanName = ((TexasElectricityAccount)subAccount).ProductName;
                    }
                }
            }

            return result;
        }

    }
}
