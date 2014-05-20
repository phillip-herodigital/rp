using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.MyStream.Controllers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;

namespace StreamEnergy.MyStream.Tests
{
    [TestClass]
    public class EnrollmentControllerTest
    {
        private Unity.Container container;
        private IOffer[] offers;
        private IdentityQuestion[] identityQuestions;

        [TestInitialize]
        public void InitializeTest()
        {
            container = ContainerSetup.Create();

            // TODO - remove this mock and replace with a service-level mock
            Mock<IEnrollmentService> service = new Mock<IEnrollmentService>();

            offers = new IOffer[] 
            { 
                new TexasElectricityOffer
                {
                    Id = "NewOffer"
                }
            };
            service.Setup(svc => svc.LoadOffers(It.IsAny<DomainModels.Address>(), It.IsAny<IEnumerable<DomainModels.IServiceCapability>>())).Returns(offers);

            // This isn't really here to be a mock, but rather a placeholder... hence it's a "stub". The real thing should come in with the service-level mock.
            Mock<IConnectDatePolicy> stub = new Mock<IConnectDatePolicy>();
            service.Setup(svc => svc.LoadConnectDates(It.IsAny<DomainModels.Address>(), It.IsAny<IEnumerable<DomainModels.IServiceCapability>>())).Returns(stub.Object);
            container.Unity.RegisterInstance(service.Object);

            // This is for the first identity check call.
            identityQuestions = new[] 
            {
                new IdentityQuestion
                {
                    QuestionId = "1",
                    QuestionText = "What is your name?",
                    Answers = new[] { 
                        new IdentityAnswer { AnswerId = "1", AnswerText = "King Arthur" },
                        new IdentityAnswer { AnswerId = "2", AnswerText = "Sir Lancelot" },
                        new IdentityAnswer { AnswerId = "3", AnswerText = "Sir Robin" },
                        new IdentityAnswer { AnswerId = "4", AnswerText = "Sir Galahad" },
                    }
                },
                new IdentityQuestion
                {
                    QuestionId = "2",
                    QuestionText = "What is your quest?",
                    Answers = new[] { 
                        new IdentityAnswer { AnswerId = "1", AnswerText = "To seek the Holy Grail." },
                    }
                },
                new IdentityQuestion
                {
                    QuestionId = "3",
                    QuestionText = "What is your favorite color?",
                    Answers = new[] { 
                        new IdentityAnswer { AnswerId = "1", AnswerText = "Blue." },
                        new IdentityAnswer { AnswerId = "2", AnswerText = "Green." },
                        new IdentityAnswer { AnswerId = "3", AnswerText = "Yellow." },
                        new IdentityAnswer { AnswerId = "4", AnswerText = "Red." },
                    }
                },
            };
            service.Setup(svc => svc.IdentityCheck(It.IsAny<DomainModels.Name>(), It.IsAny<string>(), It.IsAny<DomainModels.DriversLicense>(), It.IsAny<DomainModels.Address>(), null))
                .Returns(new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityCheckId = "01234",
                    HardStop = null,
                    IdentityQuestions = identityQuestions,
                });
        }

        [TestMethod]
        public void NewClientDataTest()
        {
            var controller = container.Resolve<EnrollmentController>();
            var clientData = controller.ClientData();

            Assert.IsNotNull(clientData);
            Assert.IsNull(clientData.UserContext.SocialSecurityNumber);
        }

        [TestMethod]
        public void SaveOnDisposeTest()
        {
            using (container.Resolve<EnrollmentController>())
            {
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.Any(key => session[key] is UserContext));
            Assert.IsTrue(keys.Any(key => session[key] is InternalContext));
            Assert.IsTrue(keys.Any(key => (session[key] as Type) == typeof(DomainModels.Enrollments.ServiceInformationState)));

            var sessionHelper = container.Resolve<EnrollmentController.SessionHelper>();

            Assert.IsTrue(sessionHelper.UserContext is UserContext);
            Assert.IsTrue(sessionHelper.InternalContext is InternalContext);
            Assert.IsTrue(sessionHelper.State == typeof(DomainModels.Enrollments.ServiceInformationState));
        }

        [TestMethod]
        public void NoSaveOnDisposeTest()
        {
            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Reset();
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.All(key => session[key] == null));
        }

        [TestMethod]
        public void PostServiceInformationTest()
        {
            // Arrange
            var request = new Models.Enrollment.ServiceInformation
            {
                IsNewService = true,
                ServiceAddress = new DomainModels.Address { PostalCode5 = "75010" },
                ServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint" } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.ServiceInformation(request);

                // Assert
                Assert.AreEqual("SelectedOffers", result.Validations.Single().MemberName);
                Assert.AreEqual("75010", result.UserContext.ServiceAddress.PostalCode5);
                Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, result.UserContext.ServiceCapabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).Tdu);
                Assert.IsTrue((result.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).IsNewService);

                Assert.IsTrue(result.Offers.Any());
                Assert.IsNotNull(result.Offers.SingleOrDefault(offer => offer.Id == "NewOffer"));
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
            Assert.AreEqual("75010", session.UserContext.ServiceAddress.PostalCode5);
            Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, session.UserContext.ServiceCapabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).Tdu);
            Assert.IsTrue((session.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).IsNewService);
            Assert.IsNotNull(session.InternalContext.AllOffers.SingleOrDefault(offer => offer.Id == "NewOffer"));
        }

        [TestMethod]
        public void PostSelectedOffersTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = new DomainModels.Address { PostalCode5 = "75010" },
                ServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint" } }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers
            };
            session.State = typeof(DomainModels.Enrollments.PlanSelectionState);
            var request = new Models.Enrollment.SelectedOffers
            {
                OfferIds = new[] { "NewOffer" }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.SelectedOffers(request);

                // Assert
                Assert.IsTrue(result.UserContext.SelectedOffers.Any(o => o.Offer.Id == "NewOffer"));
                Assert.IsNotNull(result.OfferOptionRules["NewOffer"]);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.AccountInformationState), session.State);
            Assert.IsTrue(session.UserContext.SelectedOffers.Any(o => o.Offer.Id == "NewOffer"));
            Assert.IsNotNull(session.InternalContext.OfferOptionRules["NewOffer"]);
        }

        [TestMethod]
        public void PostAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = new DomainModels.Address { PostalCode5 = "75010" },
                ServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint" } },
                SelectedOffers = new[] 
                { 
                    new SelectedOffer 
                    { 
                        Offer = offers[0]
                    }
                }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                ServiceAddress = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                ServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" } },
                ContactInfo = new DomainModels.CustomerContact
                {
                    Name = new DomainModels.Name { First = "Test", Last = "Person" },
                    Email = new DomainModels.Email { Address = "test@example.com" },
                    PrimaryPhone = new DomainModels.Phone { Number = "214-223-4567" },
                },
                BillingAddress = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                OfferOptions = new Dictionary<string, IOfferOption> { { offers[0].Id, new TexasElectricityOfferOption { ConnectDate = new DateTime(2014, 5, 1) } } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.AccountInformation(request);

                // Assert
                Assert.AreEqual("Test", result.UserContext.ContactInfo.Name.First);
                Assert.AreEqual("Person", result.UserContext.ContactInfo.Name.Last);
                Assert.AreEqual("test@example.com", result.UserContext.ContactInfo.Email.Address);
                Assert.AreEqual("2142234567", result.UserContext.ContactInfo.PrimaryPhone.Number);
                Assert.IsNotNull(result.IdentityQuestions);
                Assert.IsNull(result.UserContext.SocialSecurityNumber);
                Assert.AreEqual("en", result.UserContext.Language);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.VerifyIdentityState), session.State);
            Assert.IsTrue(session.UserContext.SelectedOffers.Any(o => o.Offer.Id == "NewOffer"));
            Assert.AreEqual("Test", session.UserContext.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.UserContext.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.UserContext.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.UserContext.ContactInfo.PrimaryPhone.Number);
            Assert.AreEqual("123456789", session.UserContext.SocialSecurityNumber);
            Assert.AreEqual("en", session.UserContext.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheckResult.IdentityQuestions);
        }
    }
}
