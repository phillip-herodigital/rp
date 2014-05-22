﻿using Microsoft.Practices.Unity;
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
        private DomainModels.Address generalAddress;
        private DomainModels.IServiceCapability[] generalServiceCapabilities;
        private IOffer[] offers;
        private IdentityQuestion[] identityQuestions;
        private DomainModels.Enrollments.Service.IdentityCheckResult identityCheckResult;
        private DomainModels.Address specificAddress;
        private DomainModels.IServiceCapability[] specificServiceCapabilities;
        private DomainModels.CustomerContact contactInfo;
        private TexasElectricityOfferOption offerOption;
        private DomainModels.Enrollments.Service.IdentityCheckResult finalIdentityCheckResult;
        private DomainModels.Enrollments.Service.LoadDepositResult loadDepositResult;

        [TestInitialize]
        public void InitializeTest()
        {
            container = ContainerSetup.Create();
            generalAddress = new DomainModels.Address { PostalCode5 = "75010" };
            generalServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint" } };
            offers = new IOffer[] 
            { 
                new TexasElectricityOffer
                {
                    Id = "NewOffer"
                }
            };
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
            identityCheckResult = new DomainModels.Enrollments.Service.IdentityCheckResult
            {
                IdentityCheckId = "01234",
                HardStop = null,
                IdentityQuestions = identityQuestions,
            };
            finalIdentityCheckResult = new DomainModels.Enrollments.Service.IdentityCheckResult
            {
                IdentityCheckId = "01235",
                HardStop = null,
                IdentityQuestions = new IdentityQuestion[0],
            };
            specificAddress = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" };
            specificServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" } };
            contactInfo = new DomainModels.CustomerContact
            {
                Name = new DomainModels.Name { First = "Test", Last = "Person" },
                Email = new DomainModels.Email { Address = "test@example.com" },
                PrimaryPhone = new DomainModels.Phone { Number = "214-223-4567" },
            };
            offerOption = new TexasElectricityOfferOption { ConnectDate = new DateTime(2014, 5, 1) };
            loadDepositResult = new DomainModels.Enrollments.Service.LoadDepositResult
            {
                Amount = 50.00m
            };
        }

        [TestMethod]
        public void NewClientDataTest()
        {
            var controller = container.Resolve<EnrollmentController>();
            var clientData = controller.ClientData();

            Assert.IsNotNull(clientData);
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
                Locations = new Dictionary<string,Location>
                { 
                    {
                        "loc",
                        new Location
                        {
                            Address = generalAddress,
                            Capabilities = generalServiceCapabilities
                        }
                    }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.ServiceInformation(request);

                // Assert
                Assert.AreEqual("Services[0].Value.SelectedOffers", result.Validations.Single().MemberName);
                Assert.AreEqual("75010", result.LocationServices["loc"].Location.Address.PostalCode5);
                Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, result.LocationServices["loc"].Location.Capabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.LocationServices["loc"].Location.Capabilities.First() as DomainModels.TexasServiceCapability).Tdu);

                Assert.IsTrue(result.Offers.Any());
                Assert.IsNotNull(result.Offers.SingleOrDefault(offer => offer.Value.First().Id == "NewOffer"));
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
            Assert.AreEqual("75010", session.UserContext.Services["loc"].Location.Address.PostalCode5);
            Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, session.UserContext.Services["loc"].Location.Capabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.UserContext.Services["loc"].Location.Capabilities.First() as DomainModels.TexasServiceCapability).Tdu);
            Assert.IsNotNull(session.InternalContext.AllOffers.SingleOrDefault(offer => offer.Item2.Id == "NewOffer"));
        }
        /*
        [TestMethod]
        public void PostSelectedOffersTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                Services = new[] 
                {
                    new ServiceSelection
                    {
                        Location = new Location
                        {
                            Address = generalAddress,
                            Capabilities = generalServiceCapabilities
                        }
                    }
                }
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
            Assert.IsNotNull(session.InternalContext.OfferOptionRulesByAddressOffer["NewOffer"]);
        }

        [TestMethod]
        public void PostAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = generalAddress,
                ServiceCapabilities = generalServiceCapabilities,
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
                ServiceAddress = specificAddress,
                ServiceCapabilities = specificServiceCapabilities,
                ContactInfo = contactInfo,
                BillingAddress = specificAddress,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                OfferOptions = new Dictionary<string, IOfferOption> { { offers[0].Id, offerOption } }
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

        [TestMethod]
        public void PostIdentityQuestionsTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = specificAddress,
                ServiceCapabilities = specificServiceCapabilities,
                SelectedOffers = new[] 
                { 
                    new SelectedOffer 
                    { 
                        Offer = offers[0],
                        OfferOption = offerOption
                    }
                },
                BillingAddress = specificAddress,
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheckResult = identityCheckResult,
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);
            var request = new Models.Enrollment.VerifyIdentity
            {
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.VerifyIdentity(request);

                // Assert
                Assert.IsFalse(result.IdentityQuestions.Any());
                Assert.AreEqual(50, result.DepositAmount);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PaymentInfoState), session.State);
        }

        [TestMethod]
        public void PostIdentityQuestionsNoDepositTest()
        {
            // Arrange
            loadDepositResult.Amount = 0;

            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = specificAddress,
                ServiceCapabilities = specificServiceCapabilities,
                SelectedOffers = new[] 
                { 
                    new SelectedOffer 
                    { 
                        Offer = offers[0],
                        OfferOption = offerOption
                    }
                },
                BillingAddress = specificAddress,
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheckResult = identityCheckResult,
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);
            var request = new Models.Enrollment.VerifyIdentity
            {
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.VerifyIdentity(request);

                // Assert
                Assert.AreEqual(0, result.DepositAmount);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
        }

        [TestMethod]
        public void PostPaymentInfoTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = specificAddress,
                ServiceCapabilities = specificServiceCapabilities,
                SelectedOffers = new[] 
                { 
                    new SelectedOffer 
                    { 
                        Offer = offers[0],
                        OfferOption = offerOption
                    }
                },
                BillingAddress = specificAddress,
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SelectedIdentityAnswers = new Dictionary<string, string>(),
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheckResult = identityCheckResult,
            };
            session.State = typeof(DomainModels.Enrollments.PaymentInfoState);
            var request = new DomainModels.Payments.TokenizedCard
                {
                    CardToken = "12345678901234567890"
                };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.PaymentInfo(request);

                // Assert
                Assert.IsNull(result.UserContext.PaymentInfo);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
            Assert.IsNotNull(session.UserContext.PaymentInfo);
        }

        [TestMethod]
        public void PostConfirmOrderTest()
        {
            // Arrange
            loadDepositResult.Amount = 0;

            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.UserContext = new UserContext
            {
                ServiceAddress = specificAddress,
                ServiceCapabilities = specificServiceCapabilities,
                SelectedOffers = new[] 
                { 
                    new SelectedOffer 
                    { 
                        Offer = offers[0],
                        OfferOption = offerOption
                    }
                },
                BillingAddress = specificAddress,
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SelectedIdentityAnswers = new Dictionary<string, string>(),
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheckResult = identityCheckResult,
            };
            session.State = typeof(DomainModels.Enrollments.CompleteOrderState);
            var request = new Models.Enrollment.ConfirmOrder
            {
                AgreeToTerms = true,
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                // Act
                var result = controller.ConfirmOrder(request);

                // Assert
                Assert.IsNotNull(result.ConfirmationNumber);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }
        */
    }
}
