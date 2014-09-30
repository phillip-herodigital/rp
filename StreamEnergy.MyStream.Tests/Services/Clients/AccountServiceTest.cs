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
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var accounts = accountService.GetAccounts(gcid).Result;
            
            // Assert
            Assert.AreEqual(acctId, accounts.Single().StreamConnectAccountId);
        }

        [TestMethod]
        public void DisassociateAccount()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var result = accountService.DisassociateAccount(gcid, acctId).Result;

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
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var details = accountService.GetAccountDetails(gcid, acctId).Result;

            // Assert
            Assert.IsNotNull(details);
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
            Assert.Inconclusive();
        }

        [TestMethod]
        public void GetAccountInvoiceUrl()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;
            var invoiceAccounts = accountService.GetInvoices(gcid).Result;
            var targetInvoice = invoiceAccounts.First(acct => acct.Invoices.Any()).Invoices.First();

            // Act
            var url = accountService.GetInvoicePdf(gcid, acctId, targetInvoice.InvoiceNumber).Result;

            // Assert
            var client = new HttpClient();
            var pdf = client.GetAsync(url).Result;
            pdf.EnsureSuccessStatusCode();
        }
    }
}
