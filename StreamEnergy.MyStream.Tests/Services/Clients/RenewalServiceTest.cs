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
    public class RenewalServiceTest
    {
        private static Unity.Container container;
        private const string renewalAccountNumber = "3001458940";

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
        [TestCategory("StreamConnect Renewals")]
        public void RenewalEligibility()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var renewalAccountSsnLast4 = accountService.GetAccountDetails(renewalAccountNumber).Result.Details.SsnLastFour;
            var acct = accountService.AssociateAccount(gcid, renewalAccountNumber, renewalAccountSsnLast4, "").Result;
            accountService.GetAccountDetails(acct).Wait();

            // Act
            var result = accountService.CheckRenewalEligibility(acct, acct.SubAccounts.First()).Result;

            // Assert
            DomainModels.Accounts.RenewalAccountCapability renewalCapability;
            Assert.IsTrue(result);
            renewalCapability = acct.SubAccounts.First().Capabilities.OfType<DomainModels.Accounts.RenewalAccountCapability>().FirstOrDefault();
            Assert.IsNotNull(renewalCapability);
            if (!renewalCapability.IsEligible)
            {
                Assert.Inconclusive("Not eligible for renewal.");
            }
            else
            {
                
            }
        }
    }
}
