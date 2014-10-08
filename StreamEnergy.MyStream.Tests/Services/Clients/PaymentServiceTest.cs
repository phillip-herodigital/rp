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
    public class PaymentServiceTest
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
        [TestCategory("StreamConnect Payments")]
        public void GetPaymentMethods()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result;
            var result = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = "9442268296134448",
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Act
            var paymentMethods = paymentService.GetSavedPaymentMethods(customerId).Result;

            // Assert
            Assert.IsTrue(paymentMethods.Any());
            Assert.IsTrue(paymentMethods.Single().RedactedData.StartsWith("***"));
            Assert.AreEqual("Test Card", paymentMethods.Single().DisplayName);
            Assert.IsTrue(paymentMethods.Single().RedactedData.Reverse().Take(4).All(c => c >= '0' && c <= '9'));
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void SavePaymentMethod()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result;

            // Act
            var result = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = "9442268296134448",
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Assert
            Assert.AreNotEqual(Guid.Empty, result);
            var paymentMethods = paymentService.GetSavedPaymentMethods(customerId).Result;
            Assert.IsTrue(paymentMethods.Any(pm => pm.Id == result));
            var paymentMethod = paymentMethods.First(pm => pm.Id == result);
            Assert.AreEqual("Test Card", paymentMethod.DisplayName);
        }


        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void DeletePaymentMethod()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result;
            var paymentMethodId = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = "9442268296134448",
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Act
            var result = paymentService.DeletePaymentMethod(customerId, paymentMethodId).Result;

            // Assert
            Assert.AreNotEqual(Guid.Empty, paymentMethodId);
            Assert.IsTrue(result);
            var paymentMethods = paymentService.GetSavedPaymentMethods(customerId).Result;
            Assert.IsFalse(paymentMethods.Any(pm => pm.Id == paymentMethodId));
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetPaymentHistory()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result;
            var acctId = accountService.AssociateAccount(gcid, "3001311049", "3192", "Sample").Result;

            // Act
            var payments = paymentService.PaymentHistory(gcid).Result;

            // Assert
            Assert.IsNotNull(payments);
            Assert.IsTrue(payments.Any());
            Assert.IsTrue(payments.First().PaymentHistory.Any());
            Assert.IsTrue(payments.First().PaymentHistory.All(h => h.PaymentAmount > 0));
        }
    }
}
