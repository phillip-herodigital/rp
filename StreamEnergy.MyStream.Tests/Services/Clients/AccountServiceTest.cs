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
                globalCustomerId = accountService.CreateStreamConnectCustomer().Result;
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
                globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

            // Act
            string email;
            using (new Timer())
            {
                email = accountService.GetEmailByCustomerId(gcid).Result;
            }

            // Assert
            Assert.AreEqual("test@example.com", email);
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
                globalCustomerId = accountService.CreateStreamConnectCustomer(portalId: "extranet//tester").Result;
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
            var gcid = accountService.CreateStreamConnectCustomer(portalId: "extranet//tester").Result;

            // Act
            HttpResponseMessage response;
            dynamic result;
            using (new Timer())
            {
                response = streamConnectClient.GetAsync("/api/v1/customers/" + gcid.ToString()).Result;
                var responseString = response.Content.ReadAsStringAsync().Result;
                result = JsonConvert.DeserializeObject(responseString);
            }

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(gcid, Guid.Parse((string)(result["Customer"]["GlobalCustomerId"].Value)));
            Assert.AreEqual("extranet//tester", result["Customer"]["PortalId"].Value);

        }
        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccounts()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;

            // Act
            var accounts = accountService.GetAccounts(gcid).Result;
            
            // Assert
            Assert.AreEqual(gcid, accounts.Single().StreamConnectCustomerId);
            Assert.AreEqual(acct.StreamConnectAccountId, accounts.Single().StreamConnectAccountId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void DisassociateAccount()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;

            // Act
            var result = accountService.DisassociateAccount(acct).Result;
            
            // Assert
            var accounts = accountService.GetAccounts(gcid).Result;
            Assert.IsNull(accounts);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;

            // Act
            var details = accountService.GetAccountDetails(acct).Result;

            // Assert
            Assert.IsTrue(details);
            Assert.IsNotNull(acct.Details);
            Assert.AreEqual("3192", acct.Details.SsnLastFour);
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
            var acct = accountService.GetAccountDetails("3001517376").Result;

            // Assert
            Assert.IsNotNull(acct);
            Assert.IsNotNull(acct.Details);
            Assert.AreEqual("0402", acct.Details.SsnLastFour);
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
            Assert.AreEqual(12, gasAccount.TermMonths);
            Assert.IsTrue(gasAccount.Rate > 0);
            Assert.IsNotNull(gasAccount.ProductId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void UpdateAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;
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
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;

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
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "").Result;
            var invoiceAccounts = accountService.GetInvoices(gcid, new[] { acct }).Result;
            var targetInvoice = invoiceAccounts.First(t => t.Invoices != null).Invoices.First();

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
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            accountService.AssociateAccount(gcid, "3001311049", "3192", "").Wait();

            // Act
            var accounts = accountService.GetAccountBalances(gcid).Result;

            // Assert
            Assert.IsNotNull(accounts.First().Balance);
            Assert.IsTrue(accounts.First().Balance.Balance >= 0);
            Assert.AreNotEqual(DateTime.MinValue, accounts.First().Balance.DueDate);
        }
    }
}
