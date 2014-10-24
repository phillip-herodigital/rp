using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.Logging;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    [TestClass]
    public class AccountServiceTest
    {
        private static Unity.Container container;

        [ClassInitialize]
        public static void ClassInitialize(TestContext context)
        {
            var mockLogger = new Mock<ILogger>();

            container = ContainerSetup.Create(c =>
                {
                    c.RegisterInstance<ILogger>(mockLogger.Object);
                    c.RegisterType<HttpMessageHandler, HttpClientHandler>("Cached");

                });
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void PostCustomersEmptyTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void PostCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);

            var customer = accountService.GetCustomerByCustomerId(globalCustomerId).Result;
            customer.EmailAddress = null;
            accountService.UpdateCustomer(customer).Wait();
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;

            // Act
            Customer customer;
            using (new Timer())
            {
                customer = accountService.GetCustomerByCustomerId(gcid).Result;
            }

            // Assert
            Assert.AreEqual("test@example.com", customer.EmailAddress);

            customer = accountService.GetCustomerByCustomerId(gcid).Result;
            customer.EmailAddress = null;
            accountService.UpdateCustomer(customer).Wait();
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void PostCustomersPortalIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer(providerKey: Guid.NewGuid().ToString(), username: "extranet//tester").Result.GlobalCustomerId;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetCustomersPortalIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            string providerKey = Guid.NewGuid().ToString();
            var gcid = accountService.CreateStreamConnectCustomer(providerKey: providerKey, username: "extranet//tester").Result.GlobalCustomerId;

            // Act
            Customer customer;
            using (new Timer())
            {
                customer = accountService.GetCustomerByCustomerId(gcid).Result;
            }

            // Assert
            Assert.AreEqual(providerKey, customer.AspNetUserProviderKey);
            Assert.AreEqual("extranet//tester", customer.Username);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void UpdateCustomerTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            string providerKey = Guid.NewGuid().ToString();
            var customer = accountService.CreateStreamConnectCustomer().Result;

            // Act
            bool result;
            using (new Timer())
            {
                customer.AspNetUserProviderKey = providerKey;
                customer.EmailAddress = "test@example.com";
                customer.Username = "extranet//tester";
                result = accountService.UpdateCustomer(customer).Result;
            }

            // Assert
            Assert.IsTrue(result);
            customer = accountService.GetCustomerByCustomerId(customer.GlobalCustomerId).Result;
            Assert.AreEqual(providerKey, customer.AspNetUserProviderKey);
            Assert.AreEqual("extranet//tester", customer.Username);
            Assert.AreEqual("test@example.com", customer.EmailAddress);

            customer = accountService.GetCustomerByCustomerId(customer.GlobalCustomerId).Result;
            customer.EmailAddress = null;
            accountService.UpdateCustomer(customer).Wait();
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void UpdateCustomerChangesTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            string providerKey = Guid.NewGuid().ToString();
            var customer = accountService.CreateStreamConnectCustomer(providerKey: providerKey, email: "test2@example.com", username: "extranet//tester2").Result;

            // Act
            bool result;
            using (new Timer())
            {
                customer.EmailAddress = "test2@example.com";
                customer.Username = "extranet//tester2";
                result = accountService.UpdateCustomer(customer).Result;
            }

            // Assert
            Assert.IsTrue(result);
            customer = accountService.GetCustomerByCustomerId(customer.GlobalCustomerId).Result;
            Assert.AreEqual(providerKey, customer.AspNetUserProviderKey);
            Assert.AreEqual("extranet//tester2", customer.Username);
            Assert.AreEqual("test2@example.com", customer.EmailAddress);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccounts()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var accounts = accountService.GetAccounts(gcid).Result;
            
            // Assert
            Assert.AreEqual(gcid, accounts.Single().StreamConnectCustomerId);
            Assert.AreEqual(acct.StreamConnectAccountId, accounts.Single().StreamConnectAccountId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void AssociateAccountWrongSsn()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;

            // Act
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, "0000", "").Result;

            // Assert
            Assert.IsNull(acct);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void DisassociateAccount()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var result = accountService.DisassociateAccount(acct).Result;
            
            // Assert
            var accounts = accountService.GetAccounts(gcid).Result;
            Assert.IsNull(accounts);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void FindAccountByEmail()
        {
            // Arrange
            var rand = new Random();
            var email = "test"+ rand.Next(1000000)+ "@example.com";
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: email).Result.GlobalCustomerId;

            // Act
            var customers = accountService.FindCustomers(email).Result;

            // Assert
            Assert.IsNotNull(customers);
            Assert.IsTrue(customers.Any());

            var customer = accountService.GetCustomerByCustomerId(gcid).Result;
            customer.EmailAddress = null;
            accountService.UpdateCustomer(customer).Wait();
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void FindAccountByAccountNumber()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var customers = accountService.FindCustomersByCisAccount(TestData.IstaAccountNumber).Result;

            // Assert
            Assert.IsNotNull(customers);
            Assert.IsTrue(customers.Any());

            foreach (var customer in customers.Where(c => c.Username == null))
            {
                foreach (var entry in accountService.GetAccounts(customer.GlobalCustomerId).Result)
                {
                    accountService.DisassociateAccount(entry).Wait();
                }
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var details = accountService.GetAccountDetails(acct).Result;

            // Assert
            Assert.IsTrue(details);
            Assert.IsNotNull(acct.Details);
            Assert.AreEqual(TestData.IstaAccountSsnLast4, acct.Details.SsnLastFour);
            Assert.IsNotNull(acct.Details.ContactInfo);
            Assert.IsNotNull(acct.Details.ContactInfo.Email);
            Assert.IsNotNull(acct.Details.ContactInfo.Name);
            Assert.IsNotNull(acct.Details.ContactInfo.Phone);
            Assert.IsTrue(acct.Details.ContactInfo.Phone.Length > 0);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountDetailsWithoutGlobalCustomer()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            var acct = accountService.GetAccountDetails(TestData.IstaAccountNumber).Result;

            // Assert
            Assert.IsNotNull(acct);
            Assert.IsNotNull(acct.Details);
            Assert.AreEqual(TestData.IstaAccountSsnLast4, acct.Details.SsnLastFour);
            Assert.IsNotNull(acct.Details.ContactInfo);
            Assert.IsNotNull(acct.Details.ContactInfo.Email);
            Assert.IsNotNull(acct.Details.ContactInfo.Name);
            Assert.IsNotNull(acct.Details.ContactInfo.Phone);
            Assert.IsTrue(acct.Details.ContactInfo.Phone.Length > 0);
            Assert.IsNotNull(acct.SubAccounts);
            Assert.IsNotNull(acct.GetCapability<ExternalPaymentAccountCapability>());
            Assert.IsNotNull(acct.GetCapability<PaymentMethodAccountCapability>());
            Assert.IsNotNull(acct.GetCapability<PaymentSchedulingAccountCapability>());
            Assert.IsTrue(acct.SubAccounts.First() is GeorgiaGasAccount);
            var gasAccount = acct.SubAccounts.First() as GeorgiaGasAccount;
            Assert.AreEqual("74", gasAccount.ProviderId);
            Assert.AreEqual(StreamEnergy.DomainModels.Enrollments.RateType.Fixed, gasAccount.RateType);
            Assert.IsNotNull(gasAccount.ProductId);
            Assert.IsNotNull(gasAccount.ProductCode);
            if (gasAccount.Rate == 0)
            {
                Assert.Inconclusive("Rate not being returned from service");
            }
            Assert.IsTrue(gasAccount.Rate > 0);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void UpdateAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            accountService.GetAccountDetails(acct).Wait();
            var rand = new Random();
            var expectedHome = "2" + rand.Next(0, 1000000000).ToString().PadLeft(9, '0');
            var expectedMobile = "2" + rand.Next(0, 1000000000).ToString().PadLeft(9, '0');
            var expectedEmail = System.IO.Path.GetFileNameWithoutExtension(System.IO.Path.GetRandomFileName()) + "@example.com";
            var expectedStreetAddress = rand.Next(1, 999).ToString() + " Main St";

            // Act
            acct.Details.ContactInfo.Phone = new[] 
            { 
                new StreamEnergy.DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = expectedHome },
                new StreamEnergy.DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Mobile, Number = expectedMobile },
            };
            acct.Details.ContactInfo.Email = new DomainModels.Email { Address = expectedEmail };
            acct.Details.BillingAddress.Line1 = expectedStreetAddress;
            var result = accountService.SetAccountDetails(acct, acct.Details).Result;

            // Assert
            Assert.IsTrue(result);
            result = accountService.GetAccountDetails(acct, forceRefresh: true).Result;
            Assert.AreEqual(expectedHome, acct.Details.ContactInfo.Phone.OfType<StreamEnergy.DomainModels.TypedPhone>().Single(p => p.Category == DomainModels.PhoneCategory.Home).Number);
            Assert.AreEqual(expectedMobile, acct.Details.ContactInfo.Phone.OfType<StreamEnergy.DomainModels.TypedPhone>().Single(p => p.Category == DomainModels.PhoneCategory.Mobile).Number);
            Assert.AreEqual(expectedEmail, acct.Details.ContactInfo.Email.Address);
            Assert.AreEqual(expectedStreetAddress, acct.Details.BillingAddress.Line1);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountInvoices()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var details = accountService.GetInvoices(gcid).Result;

            // Assert
            Assert.IsTrue(details.Any());
            Assert.AreEqual(gcid, details.First().StreamConnectCustomerId);
            Assert.AreEqual(acct.StreamConnectAccountId, details.First().StreamConnectAccountId);
            Assert.IsTrue(details.First().Invoices.Any());
            Assert.IsTrue(details.First().Invoices.First().InvoiceAmount > 0);
            Assert.IsNotNull(details.First().Invoices.First().InvoiceNumber);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountInvoiceUrl()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            var invoiceAccounts = accountService.GetInvoices(gcid, new[] { acct }).Result;
            var targetInvoice = invoiceAccounts.First(t => t.Invoices != null).Invoices.First(inv => inv.PdfAvailable);

            // Act
            var url = accountService.GetInvoicePdf(acct, targetInvoice).Result;

            // Assert
            var client = new HttpClient();
            var pdf = client.GetAsync(url.ToString()).Result;
            pdf.EnsureSuccessStatusCode();
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountBalance()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Wait();

            // Act
            var accounts = accountService.GetAccountBalances(gcid).Result;

            // Assert
            Assert.IsNotNull(accounts.First().Balance);
            Assert.AreNotEqual(0, accounts.First().Balance.Balance);
            Assert.AreNotEqual(DateTime.MinValue, accounts.First().Balance.DueDate);
        }
    }
}
