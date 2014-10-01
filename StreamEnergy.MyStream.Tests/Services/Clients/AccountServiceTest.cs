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
using StreamEnergy.Logging;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    [TestClass]
    public class AccountServiceTest
    {
        private static Unity.Container container;

        class Timer : IDisposable
        {
            private readonly Stopwatch sw;

            public Timer()
            {
                sw = new Stopwatch();
                sw.Start();
            }

            void IDisposable.Dispose()
            {
                sw.Stop();
                Trace.WriteLine(sw.ElapsedMilliseconds);
            }
        }

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
        public void GetAccounts()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var accounts = accountService.GetAccounts(gcid).Result;
            
            // Assert
            Assert.AreEqual(gcid, accounts.Single().StreamConnectCustomerId);
            Assert.AreEqual(acct.StreamConnectAccountId, accounts.Single().StreamConnectAccountId);
        }

        [TestMethod]
        public void DisassociateAccount()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var result = accountService.DisassociateAccount(acct).Result;

            // Assert
            var accounts = accountService.GetAccounts(gcid).Result;
            Assert.IsNull(accounts);
        }

        [TestMethod]
        public void GetAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var details = accountService.GetAccountDetails(acct).Result;

            // Assert
            Assert.IsTrue(details);
            Assert.IsNotNull(acct.Details);
            Assert.IsNotNull(acct.Details.ContactInfo);
            Assert.IsNotNull(acct.Details.ContactInfo.Email);
            Assert.IsNotNull(acct.Details.ContactInfo.Name);
            Assert.IsNotNull(acct.Details.ContactInfo.Phone);
            Assert.IsTrue(acct.Details.ContactInfo.Phone.Length > 0);
        }

        [TestMethod]
        public void UpdateAccountDetails()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;
            accountService.GetAccountDetails(acct).Wait();

            // Act
            var expected = "2" + new Random().Next(0, 1000000000).ToString().PadLeft(9, '0');
            acct.Details.ContactInfo.Phone = new[] { new StreamEnergy.DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = expected } };
            var result = accountService.SetAccountDetails(acct, acct.Details).Result;

            // Assert
            Assert.IsTrue(result);
            result = accountService.GetAccountDetails(acct, forceRefresh: true).Result;
            Assert.AreEqual(expected, acct.Details.ContactInfo.Phone.Single().Number);
            Assert.IsNotNull(acct.Details);
            Assert.Inconclusive();
        }

        [TestMethod]
        public void GetAccountInvoices()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var details = accountService.GetInvoices(gcid).Result;

            // Assert
            Assert.IsTrue(details.Any());
            Assert.IsTrue(details.First().Invoices.Any());
            Assert.IsTrue(details.First().Invoices.First().InvoiceAmount > 0);
            Assert.IsNotNull(details.First().Invoices.First().InvoiceNumber);
        }

        [TestMethod]
        public void GetAccountInvoiceUrl()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;
            var invoiceAccounts = accountService.GetInvoices(gcid, new[] { acct }).Result;
            var targetInvoice = acct.Invoices.First();

            // Act
            var url = accountService.GetInvoicePdf(acct, targetInvoice).Result;

            // Assert
            var client = new HttpClient();
            var pdf = client.GetAsync(url.ToString()).Result;
            pdf.EnsureSuccessStatusCode();
        }
    }
}
