using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using System.Net.Http;
using Legacy = StreamEnergy.DomainModels.Accounts.Legacy;

namespace StreamEnergy.Services.Clients
{
    class AccountService : IAccountService
    {
        private readonly Sample.Commons.SampleStreamCommonsSoap service;
        private readonly StreamCommons.Account.CisAccountServicesPortType accountService;
        private readonly StreamEnergy.Dpi.DPILinkSoap dpiLinkService;
        private readonly HttpClient client;

        public AccountService(Sample.Commons.SampleStreamCommonsSoap service, StreamCommons.Account.CisAccountServicesPortType accountService, StreamEnergy.Dpi.DPILinkSoap dpiLinkService, [Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client)
        {
            this.service = service;
            this.accountService = accountService;
            this.dpiLinkService = dpiLinkService;
            this.client = client;
        }

        IEnumerable<Account> IAccountService.GetInvoices(string username)
        {
            // TODO - load from Stream Commons
            var response = service.GetInvoices(new Sample.Commons.GetInvoicesRequest { Username = username });

            return from entry in response.Invoice
                   group new DomainModels.Accounts.Invoice
                   {
                       DueDate = entry.DueDate,
                       InvoiceAmount = entry.InvoiceAmount,
                       InvoiceNumber = entry.InvoiceNumber,
                       IsPaid = entry.IsPaid,
                   } by new { entry.AccountNumber, entry.ServiceType, entry.CanRequestExtension } into invoicesByAcount
                   select new Account
                   {
                       AccountNumber = invoicesByAcount.Key.AccountNumber,
                       AccountType = invoicesByAcount.Key.ServiceType,
                       Capabilities = { new InvoiceExtensionAccountCapability { CanRequestExtension = invoicesByAcount.Key.CanRequestExtension } },
                       Invoices = invoicesByAcount.ToArray(),
                       // TODO - populate the CurrentInvoice?
                   };
        }

        Task<IEnumerable<Account>> IAccountService.GetCurrentInvoices(string username)
        {
            // TODO - load from Stream Commons
            return Task.FromResult<IEnumerable<Account>>(new[] {
                new Account {
                    AccountNumber = "1234567890", 
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(2), InvoiceAmount = 73.05m, InvoiceNumber="", IsPaid = false },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true }  , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } }
                    }
                },
                new Account {
                    AccountNumber = "5678901234",
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(12), InvoiceAmount = 24.95m, InvoiceNumber="", IsPaid = false }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
                new Account { 
                    AccountNumber = "2345060992", 
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(19), InvoiceAmount = 54.05m, InvoiceNumber="", IsPaid = false }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = false }, 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
                new Account {
                    AccountNumber = "3429500293",
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(29), InvoiceAmount = 36.00m, InvoiceNumber="", IsPaid = false }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } ,
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
            });
        }

        Task<Account> IAccountService.GetCurrentInvoice(string accountNumber)
        {
            // TODO - load from Stream Commons
            return Task.FromResult<Account>(
                new Account {
                    AccountNumber = accountNumber,
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(2), InvoiceAmount = 123.45m, InvoiceNumber="", IsPaid = false },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true }, 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } }
                    }
                }
            );
        }

        Task<IEnumerable<DomainModels.Payments.SavedPaymentInfo>> IAccountService.GetSavedPaymentMethods(string username)
        {
            return Task.FromResult<IEnumerable<DomainModels.Payments.SavedPaymentInfo>>(new[] { 
                new DomainModels.Payments.SavedPaymentInfo { DisplayName = "Saved Credit Card", Id="753159", RedactedData= "**** **** **** 1234", UnderlyingPaymentType = DomainModels.Payments.TokenizedCard.Qualifier },
                new DomainModels.Payments.SavedPaymentInfo { DisplayName = "Saved Bank", Id="456852", RedactedData= "*****1234", UnderlyingPaymentType = DomainModels.Payments.BankPaymentInfo.Qualifier },
            });
        }

        Task<MakePaymentResult> IAccountService.MakePayment(string account, decimal amount, DomainModels.Payments.IPaymentInfo paymentMethod, DateTime paymentDate)
        {
            return Task.FromResult(new MakePaymentResult
                {
                    ConfirmationNumber = account + "123"
                });
        }

        string IAccountService.GetIgniteAssociateFromCustomerNumber(string Auth_ID, string Auth_PW, string customerNumber)
        {
            var response = dpiLinkService.Stream_GetSponsor(Auth_ID, Auth_PW, customerNumber);
            return response.SponsorNumber;
        }

        Legacy.CustomerAccount IAccountService.RetrieveIgniteAssociateContactInfo(string Auth_ID, string Auth_PW, string IA_Number)
        {
            var response = dpiLinkService.Stream_RetrieveIaContactInfo(Auth_ID, Auth_PW, IA_Number);
            var contactInfo = response.RetrieveIaContactInfo;

            return new Legacy.CustomerAccount()
            {
                Name = new DomainModels.Name()
                {
                    First = contactInfo.Name_First,
                    Last = contactInfo.Name_Last,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Primary,
                },
                Work = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Work,
                },
                Cell = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Cell,
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = contactInfo.Street,
                    Line2 = contactInfo.Street2,
                    City = contactInfo.City,
                    StateAbbreviation = contactInfo.State,
                    PostalCode5 = contactInfo.Zip,
                },
                Email = new DomainModels.Email()
                {
                    Address = contactInfo.Email,
                },
            };
        }

        Legacy.CustomerAccount IAccountService.GetCisAccountsByUtilityAccountNumber(string utilityAccountNumber, string customerPin, string cisOfRecord)
        {
            var response = accountService.getCisAccountsByUtilityAccountNumber(new StreamCommons.Account.getCisAccountsByUtilityAccountNumberRequest1()
                {
                    GetCisAccountsByUtilityAccountNumberRequest = new StreamCommons.Account.GetCisAccountsByUtilityAccountNumberRequest()
                    {
                        utilityAccountNumber = utilityAccountNumber,
                        customerPin = customerPin,
                        cisOfRecord = cisOfRecord,
                    },
                });
            var account = response.GetCisAccountsByUtilityAccountNumberResponse1.FirstOrDefault();

            return new Legacy.CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                Name = new DomainModels.Name()
                {
                    First = account.firstName,
                    Last = account.lastName,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = account.primaryPhone,
                },
                Email = new DomainModels.Email()
                {
                    Address = account.emailAddress
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = account.billingAddress.street,
                    Line2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }

        Legacy.CustomerAccount IAccountService.GetCisAccountsByCisAccountNumber(string cisAccountNumber, string customerPin, string cisOfRecord)
        {
            var response = accountService.getCisAccountsByCisAccountNumber(new StreamCommons.Account.getCisAccountsByCisAccountNumberRequest1()
                {
                    GetCisAccountsByCisAccountNumberRequest = new StreamCommons.Account.GetCisAccountsByCisAccountNumberRequest()
                    {
                        cisAccountNumber = cisAccountNumber,
                        customerPin = customerPin,
                        cisOfRecord = cisOfRecord,
                    },
                });
            var account = response.GetCisAccountsByCisAccountNumberResponse1.FirstOrDefault();

            return new Legacy.CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                Name = new DomainModels.Name()
                {
                    First = account.firstName,
                    Last = account.lastName,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = account.primaryPhone,
                },
                Email = new DomainModels.Email()
                {
                    Address = account.emailAddress,
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = account.billingAddress.street,
                    Line2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }
    }
}
