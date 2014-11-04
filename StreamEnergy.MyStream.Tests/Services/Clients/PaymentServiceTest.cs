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
using StreamEnergy.DomainModels.Payments;
using StreamEnergy.Logging;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    [TestClass]
    public class PaymentServiceTest
    {
        private static Unity.Container container;
        private static Random rand = new Random();

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
            var customer = accountService.CreateStreamConnectCustomer().Result;
            var acct = accountService.AssociateAccount(customer.GlobalCustomerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            var result = paymentService.SavePaymentMethod(customer.GlobalCustomerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Act
            var paymentMethods = paymentService.GetSavedPaymentMethods(customer.GlobalCustomerId).Result;

            // Assert
            Assert.IsTrue(paymentMethods.Any());
            Assert.IsTrue(paymentMethods.Single().PaymentMethod.RedactedData.StartsWith("***"));
            Assert.AreEqual("Test Card", paymentMethods.Single().PaymentMethod.DisplayName);

            if (paymentMethods.Single().PaymentMethod.RedactedData.Reverse().Take(4).All(c => c >= '0' && c <= '9'))
            {

            }
            else
            {
                Assert.Inconclusive("Redacted data not being received from service.");
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void SaveCardPaymentMethod()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(customerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var result = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123",
                Name = TestData.NameOnCard
            }, "Test Card").Result;

            // Assert
            Assert.AreNotEqual(Guid.Empty, result);
            var paymentMethods = paymentService.GetSavedPaymentMethods(customerId).Result;
            Assert.IsTrue(paymentMethods.Any(pm => pm.PaymentMethod.Id == result));
            Assert.IsFalse(paymentMethods.First(pm => pm.PaymentMethod.Id == result).UsedInAutoPay);
            var paymentMethod = paymentMethods.First(pm => pm.PaymentMethod.Id == result).PaymentMethod;
            Assert.AreEqual("Test Card", paymentMethod.DisplayName);
            Assert.AreEqual(DomainModels.Payments.TokenizedCard.Qualifier, paymentMethod.UnderlyingPaymentType);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void SaveBankPaymentMethod()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(customerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;

            // Act
            var result = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedBank
            {
                AccountToken = TestData.BankToken,
                RoutingNumber = TestData.BankRoutingNumber,
                Category = DomainModels.Payments.BankAccountCategory.Checking,
                Name = TestData.NameOnBank
            }, "Test Card").Result;

            // Assert
            Assert.AreNotEqual(Guid.Empty, result);
            var paymentMethods = paymentService.GetSavedPaymentMethods(customerId).Result;
            Assert.IsTrue(paymentMethods.Any(pm => pm.PaymentMethod.Id == result));
            Assert.IsFalse(paymentMethods.First(pm => pm.PaymentMethod.Id == result).UsedInAutoPay);
            var paymentMethod = paymentMethods.First(pm => pm.PaymentMethod.Id == result).PaymentMethod;
            Assert.AreEqual("Test Card", paymentMethod.DisplayName);
            Assert.AreEqual(DomainModels.Payments.TokenizedBank.Qualifier, paymentMethod.UnderlyingPaymentType);
        }


        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void DeletePaymentMethod()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(customerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            var paymentMethodId = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedCard
            {
                CardToken = TestData.CardToken,
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
            Assert.IsFalse(paymentMethods.Any(pm => pm.PaymentMethod.Id == paymentMethodId));
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Accounts")]
        public void GetPaymentHistory()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acctId = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "Sample").Result;

            // Act
            var payments = paymentService.PaymentHistory(gcid).Result;

            // Assert
            Assert.IsNotNull(payments);
            Assert.IsTrue(payments.Any());
            Assert.IsTrue(payments.First().PaymentHistory.Any());
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect AutoPay")]
        public void GetAutoPayTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "Sample").Result;

            // Act
            var autoPayStatus = paymentService.GetAutoPayStatus(acct).Result;

            // Assert
            Assert.IsNotNull(autoPayStatus);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect AutoPay")]
        public void SetAutoPayTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "Sample").Result;
            var paymentMethodId = paymentService.SavePaymentMethod(gcid, new DomainModels.Payments.TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Act
            var result = paymentService.SetAutoPayStatus(acct, new DomainModels.Payments.AutoPaySetting
                {
                    IsEnabled = true,
                    PaymentMethodId = paymentMethodId
                },
                "123").Result;

            // Assert
            Assert.IsTrue(result);
            var autoPayStatus = paymentService.GetAutoPayStatus(acct).Result;
            Assert.IsNotNull(autoPayStatus);
            Assert.IsTrue(autoPayStatus.IsEnabled);
            Assert.AreEqual(paymentMethodId, autoPayStatus.PaymentMethodId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect AutoPay")]
        public void ClearAutoPayTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var gcid = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(gcid, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "Sample").Result;
            var paymentMethodId = paymentService.SavePaymentMethod(gcid, new DomainModels.Payments.TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;
            paymentService.SetAutoPayStatus(acct, new DomainModels.Payments.AutoPaySetting
            {
                IsEnabled = true,
                PaymentMethodId = paymentMethodId
            },
            "123").Wait();

            // Act
            var result = paymentService.SetAutoPayStatus(acct, new DomainModels.Payments.AutoPaySetting
            {
                IsEnabled = false,
                PaymentMethodId = Guid.Empty
            }, null).Result;

            // Assert
            Assert.IsTrue(result);
            var autoPayStatus = paymentService.GetAutoPayStatus(acct).Result;
            Assert.IsNotNull(autoPayStatus);
            Assert.IsFalse(autoPayStatus.IsEnabled);
            Assert.AreEqual(Guid.Empty, autoPayStatus.PaymentMethodId);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void MakeCardPaymentTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();

            var acct = accountService.GetAccountDetails(TestData.IstaAccountNumber).Result;

            // Act
            var result = paymentService.OneTimePayment(DateTime.Today, rand.Next(0, 500) / 100.0m, TestData.IstaAccountNumber, acct.Details.ContactInfo.Name.First + " " + acct.Details.ContactInfo.Name.Last, acct.SystemOfRecord, new TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }).Result;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ConfirmationNumber);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void MakeSavedCardPaymentTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(customerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            accountService.GetAccountDetails(acct).Wait();
            var paymentMethodId = paymentService.SavePaymentMethod(customerId, new TokenizedCard
            {
                CardToken = TestData.CardToken,
                BillingZipCode = "75201",
                ExpirationDate = DateTime.Today.AddDays(60),
                SecurityCode = "123"
            }, "Test Card").Result;

            // Act
            var result = paymentService.OneTimePayment(DateTime.Today, rand.Next(0, 500) / 100.0m, acct.Details.ContactInfo.Name.First + " " + acct.Details.ContactInfo.Name.Last, acct, new SavedPaymentInfo
            {
                Id = paymentMethodId,
                UnderlyingPaymentType = TokenizedBank.Qualifier
            }, "123").Result;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ConfirmationNumber);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void MakeBankPaymentTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();

            var acct = accountService.GetAccountDetails(TestData.IstaAccountNumber).Result;

            // Act
            var result = paymentService.OneTimePayment(DateTime.Today, rand.Next(0, 500) / 100.0m, TestData.IstaAccountNumber, acct.Details.ContactInfo.Name.First + " " + acct.Details.ContactInfo.Name.Last, acct.SystemOfRecord, new TokenizedBank
            {
                AccountToken = TestData.BankToken,
                RoutingNumber = TestData.BankRoutingNumber,
                Category = BankAccountCategory.Checking,
            }).Result;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ConfirmationNumber);
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Payments")]
        public void MakeSavedBankPaymentTest()
        {
            // Arrange
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Payments.IPaymentService paymentService = container.Resolve<StreamEnergy.Services.Clients.PaymentService>();
            var customerId = accountService.CreateStreamConnectCustomer().Result.GlobalCustomerId;
            var acct = accountService.AssociateAccount(customerId, TestData.IstaAccountNumber, TestData.IstaAccountSsnLast4, "").Result;
            accountService.GetAccountDetails(acct).Wait();
            var paymentMethodId = paymentService.SavePaymentMethod(customerId, new DomainModels.Payments.TokenizedBank
            {
                AccountToken = TestData.BankToken,
                RoutingNumber = TestData.BankRoutingNumber,
                Category = DomainModels.Payments.BankAccountCategory.Checking
            }, "Test Card").Result;

            // Act
            var result = paymentService.OneTimePayment(DateTime.Today, rand.Next(0, 500) / 100.0m, acct.Details.ContactInfo.Name.First + " " + acct.Details.ContactInfo.Name.Last, acct, new SavedPaymentInfo
            {
                Id = paymentMethodId,
                UnderlyingPaymentType = TokenizedBank.Qualifier
            }, "123").Result;

            // Assert
            Assert.IsNotNull(result);
            Assert.IsNotNull(result.ConfirmationNumber);
        }
    }
}
