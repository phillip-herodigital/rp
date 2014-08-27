using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http.Controllers;
using StreamEnergy.MyStream.Controllers.ApiControllers;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Tests
{
    [TestClass]
    public class EnrollmentControllerTest
    {
        private Unity.Container container;
        private DomainModels.Enrollments.Location generalLocation;
        private DomainModels.Enrollments.Location generalLocationSwitch;
        private DomainModels.Enrollments.Location specificLocation;
        private DomainModels.Enrollments.Location specificLocationSwitch;
        private IOffer[] offers;
        private IdentityQuestion[] identityQuestions;
        private DomainModels.Enrollments.Service.IdentityCheckResult identityCheckResult;
        private DomainModels.CustomerContact contactInfo;
        private TexasElectricityOfferOption offerOption;
        private DomainModels.Enrollments.Service.IdentityCheckResult finalIdentityCheckResult;
        private Mock<IEnrollmentService> mockEnrollmentService;
        private Address mailingAddress;
        private Address previousAddress;

        [TestInitialize]
        public void InitializeTest()
        {
            mockEnrollmentService = new Mock<IEnrollmentService>();
            var mockAccountService = new Mock<DomainModels.Accounts.IAccountService>();

            container = ContainerSetup.Create((uc) =>
            {
                uc.RegisterInstance<IEnrollmentService>(mockEnrollmentService.Object);
                uc.RegisterInstance<DomainModels.Accounts.IAccountService>(mockAccountService.Object);
            });


            generalLocation = new Location
            {
                Address = new DomainModels.Address { PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn } 
                }
            };
            generalLocationSwitch = new Location
            {
                Address = new DomainModels.Address { PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch } 
                }
            };
            offers = new IOffer[] 
            { 
                new TexasElectricityOffer
                {
                    Id = "24-month-fixed-rate"
                },
                new TexasElectricityOffer
                {
                    Id = "Month-to-month",
                    TermMonths = 1
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
            specificLocation = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn } 
                }
            };
            specificLocationSwitch = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch } 
                }
            };
            contactInfo = new DomainModels.CustomerContact
            {
                Name = new DomainModels.Name { First = "Test", Last = "Person" },
                Email = new DomainModels.Email { Address = "test@example.com" },
                Phone = new[] { new DomainModels.TypedPhone { Number = "214-223-4567", Category = StreamEnergy.DomainModels.PhoneCategory.Home } },
            };
            offerOption = new TexasElectricityMoveInOfferOption { ConnectDate = new DateTime(2014, 5, 1) };
            mailingAddress = new Address { Line1 = "123 Main St", City = "Dallas", StateAbbreviation = "TX", PostalCode5 = "75201" };
            previousAddress = new Address { Line1 = "123 Main St", City = "Richardson", StateAbbreviation = "TX", PostalCode5 = "75080" };

            var enrollmentService = (IEnrollmentService)container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            mockEnrollmentService.Setup(m => m.BeginSaveEnrollment(It.IsAny<Guid>(), It.IsAny<UserContext>())).Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>()
                {
                    IsCompleted = false
                }));

            mockEnrollmentService.Setup(m => m.EndSaveEnrollment(It.IsAny<StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>>())).Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>()
            {
                Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult 
                { 
                    Results = new[] {
                        new DomainModels.Enrollments.Service.EnrollmentSaveEntry 
                        { 
                            CisAccountNumber = "cis",
                            StreamReferenceNumber = "stream",
                            GlobalEnrollmentAccountId = Guid.NewGuid(),
                        }
                    }
                },
                IsCompleted = true
            }));

            mockEnrollmentService.Setup(m => m.BeginIdentityCheck(It.IsAny<Guid>(), It.IsAny<Name>(), It.IsAny<string>(), It.IsAny<Address>(), It.IsAny<AdditionalIdentityInformation>())).Returns(Task.FromResult(new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>
            {
                IsCompleted = false,
            }));
            mockEnrollmentService.Setup(m => m.BeginIdentityCheck(It.IsAny<Guid>(), It.IsAny<Name>(), "333224444", It.IsAny<Address>(), null)).Returns(Task.FromResult(new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>
            {
                IsCompleted = true,
                Data = new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityAccepted = false,
                    HardStop = null,
                    IdentityCheckId = "01234",
                    IdentityQuestions = new IdentityQuestion[0]
                }
            }));
            mockEnrollmentService.Setup(m => m.BeginIdentityCheck(It.IsAny<Guid>(), It.IsAny<Name>(), It.Is<string>(s => s != "333224444"), It.IsAny<Address>(), null)).Returns(Task.FromResult(new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>
            {
                IsCompleted = true,
                Data = new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityAccepted = false,
                    HardStop = null,
                    IdentityCheckId = "01234",
                    IdentityQuestions = new[] 
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
                    }
                }
            }));
            mockEnrollmentService.Setup(m => m.EndIdentityCheck(It.IsAny<DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>>())).Returns(Task.FromResult(new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>
            {
                IsCompleted = true,
                Data = new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityCheckId = "01235",
                    IdentityAccepted = true,
                    HardStop = null,
                    IdentityQuestions = new IdentityQuestion[0],
                }
            }));
            mockEnrollmentService.Setup(m => m.LoadOfferPayments(It.IsAny<IEnumerable<LocationServices>>())).Returns<IEnumerable<LocationServices>>(loc => enrollmentService.LoadOfferPayments(loc));
            mockEnrollmentService.Setup(m => m.PlaceOrder(It.IsAny<Guid>(), It.IsAny<IEnumerable<LocationServices>>(), It.IsAny<DomainModels.Enrollments.Service.EnrollmentSaveResult>(), It.IsAny<Dictionary<AdditionalAuthorization,bool>>()))
                .Returns(Task.FromResult<IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>>>(new[] 
                {
                    new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>
                    {
                        Offer = offers.First(),
                        Location = specificLocation,
                        Details = new DomainModels.Enrollments.Service.PlaceOrderResult
                        {
                            ConfirmationNumber = "87654321"
                        }
                    }
                }));

            mockEnrollmentService.Setup(s => s.LoadOffers(It.IsAny<IEnumerable<Location>>()))
                .Returns<IEnumerable<Location>>(locations => Task.FromResult(locations.ToDictionary(location => location, location =>
            {
                return new LocationOfferSet { Offers = offers.ToArray() };
            })));
            mockEnrollmentService.Setup(m => m.LoadConnectDates(It.IsAny<Location>())).Returns(Task.FromResult<IConnectDatePolicy>(new ConnectDatePolicy() { AvailableConnectDates = new ConnectDate[] { } }));

        }

        [TestMethod]
        public void NewClientDataTest()
        {
            var controller = container.Resolve<EnrollmentController>();
            controller.Initialize().Wait();
            var clientData = controller.ClientData();

            Assert.IsNotNull(clientData);
        }

        [TestMethod]
        public async Task SaveOnDisposeTest()
        {
            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.Any(key => session[key] is UserContext));
            Assert.IsTrue(keys.Any(key => session[key] is InternalContext));
            Assert.IsTrue(keys.Any(key => (session[key] as Type) == typeof(DomainModels.Enrollments.ServiceInformationState)));

            var sessionHelper = container.Resolve<EnrollmentController.SessionHelper>();
            await sessionHelper.EnsureInitialized();

            Assert.IsTrue(sessionHelper.Context is UserContext);
            Assert.IsTrue(sessionHelper.InternalContext is InternalContext);
            Assert.IsTrue(sessionHelper.State == typeof(DomainModels.Enrollments.ServiceInformationState));
        }

        [TestMethod]
        public async Task NoSaveOnDisposeTest()
        {
            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
                controller.Reset();
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.All(key => session[key] == null));
        }

        [TestMethod]
        public async Task PostServiceInformationTest()
        {
            // Arrange
            var request = new Models.Enrollment.ServiceInformation
            {
                Locations = new[]
                { 
                    generalLocation
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
                
                // Act
                var result = await controller.ServiceInformation(request);

                // Assert
                Assert.IsTrue(result.Validations.Any(r => r.MemberName == "Services[0].SelectedOffers"));
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSelection, result.ExpectedState);
                Assert.AreEqual("75010", result.Cart.Single().Location.Address.PostalCode5);
                Assert.AreEqual(DomainModels.Enrollments.TexasServiceCapability.Qualifier, result.Cart.Single().Location.Capabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.Cart.Single().Location.Capabilities.First() as DomainModels.Enrollments.TexasServiceCapability).Tdu);

                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.AvailableOffers.Any());
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.AvailableOffers.SingleOrDefault(offer => offer.Id == "24-month-fixed-rate"));
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
            Assert.AreEqual("75010", session.Context.Services.First().Location.Address.PostalCode5);
            Assert.AreEqual(DomainModels.Enrollments.TexasServiceCapability.Qualifier, session.Context.Services.First().Location.Capabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.Context.Services.First().Location.Capabilities.First() as DomainModels.Enrollments.TexasServiceCapability).Tdu);
            Assert.IsNotNull(session.InternalContext.AllOffers[session.Context.Services.First().Location].Offers.SingleOrDefault(offer => offer.Id == "24-month-fixed-rate"));
        }

        [TestMethod]
        public async Task PostSelectedOffersTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();
            session.Context = new UserContext
            {
                Services = new[] 
                {
                    new LocationServices
                    {
                        Location = generalLocation
                    }
                }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.PlanSelectionState);
            var request = new Models.Enrollment.SelectedOffers
            {
                Selection = new[] {
                    new Models.Enrollment.SelectedOfferSet { Location = specificLocation, OfferIds = new[] { "24-month-fixed-rate" } }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
                
                // Act
                var result = await controller.SelectedOffers(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSettings, result.ExpectedState);
                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Any(o => o.OfferId == "24-month-fixed-rate"));
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Single(o => o.OfferId == "24-month-fixed-rate").OptionRules);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.AccountInformationState), session.State);
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
            Assert.IsNotNull(session.InternalContext.OfferOptionRules.SingleOrDefault(e => e.Location == specificLocation && e.Offer.Id == "24-month-fixed-rate").Details);
        }

        [TestMethod]
        public void PostAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[] {
                    new LocationServices
                    {
                        Location = generalLocation,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0]
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                Cart = new[] {
                    new Models.Enrollment.CartEntry {
                        Location = specificLocation,
                        OfferInformationByType = new Dictionary<string,Models.Enrollment.OfferInformation>
                        {
                            {
                                offers[0].OfferType,
                                new Models.Enrollment.OfferInformation
                                {
                                    OfferSelections = new []
                                    {
                                        new Models.Enrollment.OfferSelection
                                        {
                                            OfferId = offers[0].Id,
                                            OfferOption = offerOption
                                        }
                                    }
                                }
                            }
                        }.ToArray()
                    }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();
                
                // Act
                var result = controller.AccountInformation(request).Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.VerifyIdentity, result.ExpectedState);
                Assert.AreEqual("Test", result.ContactInfo.Name.First);
                Assert.AreEqual("Person", result.ContactInfo.Name.Last);
                Assert.AreEqual("test@example.com", result.ContactInfo.Email.Address);
                Assert.AreEqual("2142234567", result.ContactInfo.Phone[0].Number);
                Assert.IsNotNull(result.IdentityQuestions);
                Assert.AreEqual("en", result.Language);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.VerifyIdentityState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("123456789", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(3, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
        }

        [TestMethod]
        public void PostAccountInformationSwitchTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[] {
                    new LocationServices
                    {
                        Location = generalLocationSwitch,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0]
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalLocationSwitch, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                MailingAddress = mailingAddress,
                Cart = new[] {
                    new Models.Enrollment.CartEntry {
                        Location = specificLocationSwitch,
                        OfferInformationByType = new Dictionary<string,Models.Enrollment.OfferInformation>
                        {
                            {
                                offers[0].OfferType,
                                new Models.Enrollment.OfferInformation
                                {
                                    OfferSelections = new []
                                    {
                                        new Models.Enrollment.OfferSelection
                                        {
                                            OfferId = offers[0].Id,
                                            OfferOption = offerOption
                                        }
                                    }
                                }
                            }
                        }.ToArray()
                    }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.AccountInformation(request).Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.VerifyIdentity, result.ExpectedState);
                Assert.AreEqual("Test", result.ContactInfo.Name.First);
                Assert.AreEqual("Person", result.ContactInfo.Name.Last);
                Assert.AreEqual("test@example.com", result.ContactInfo.Email.Address);
                Assert.AreEqual("2142234567", result.ContactInfo.Phone[0].Number);
                Assert.IsNotNull(result.IdentityQuestions);
                Assert.AreEqual("en", result.Language);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.VerifyIdentityState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificLocationSwitch));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("123456789", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(3, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
        }

        [TestMethod]
        public async Task PostAccountInformationNoQuestionsTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();
            session.Context = new UserContext
            {
                Services = new[] {
                    new LocationServices
                    {
                        Location = generalLocation,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0]
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "333-22-4444",
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                Cart = new[] {
                    new Models.Enrollment.CartEntry {
                        Location = specificLocation,
                        OfferInformationByType = new Dictionary<string,Models.Enrollment.OfferInformation>
                        {
                            {
                                offers[0].OfferType,
                                new Models.Enrollment.OfferInformation
                                {
                                    OfferSelections = new []
                                    {
                                        new Models.Enrollment.OfferSelection
                                        {
                                            OfferId = offers[0].Id,
                                            OfferOption = offerOption
                                        }
                                    }
                                }
                            }
                        }.ToArray()
                    }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.AccountInformation(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
                Assert.AreEqual("Test", result.ContactInfo.Name.First);
                Assert.AreEqual("Person", result.ContactInfo.Name.Last);
                Assert.AreEqual("test@example.com", result.ContactInfo.Email.Address);
                Assert.AreEqual("2142234567", result.ContactInfo.Phone[0].Number);
                Assert.IsNotNull(result.IdentityQuestions);
                Assert.AreEqual("en", result.Language);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PaymentInfoState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("333224444", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(0, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
        }

        [TestMethod]
        public void PostIdentityQuestionsTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[]
                {
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                ContactInfo = contactInfo,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = identityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> { IsCompleted = true },
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);
            var request = new Models.Enrollment.VerifyIdentity
            {
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();
                
                // Act
                var result = controller.VerifyIdentity(request).Result;

                // Assert
                Assert.AreEqual(true, result.IsLoading);
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.VerifyIdentity, result.ExpectedState);
            }
        }


        [TestMethod]
        public void ResumePostIdentityQuestionsTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[]
                {
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                ContactInfo = contactInfo,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = false },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> { IsCompleted = true },
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();
                
                // Act
                var result = controller.Resume().Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
                Assert.IsFalse(result.IdentityQuestions.Any());
                Assert.AreEqual(75.25m, result.Cart.Sum(l => l.OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Sum(sel => sel.Payments.RequiredAmounts.Sum(p => p.DollarAmount))));
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PaymentInfoState), session.State);
        }

        [TestMethod]
        public async Task PostIdentityQuestionsNoDepositTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();
            session.Context = new UserContext
            {
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new [] 
                        {
                            new SelectedOffer 
                            { 
                                Offer = offers[1],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                ContactInfo = contactInfo,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = identityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> { IsCompleted = true },
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);
            var request = new Models.Enrollment.VerifyIdentity
            {
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
                
                // Act
                var result = await controller.VerifyIdentity(request);
                
                // Assert
                Assert.AreEqual(true, result.IsLoading);
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.VerifyIdentity, result.ExpectedState);
            }
        }


        [TestMethod]
        public void ResumePostIdentityQuestionsNoDepositTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new [] 
                        {
                            new SelectedOffer 
                            { 
                                Offer = offers[1],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                ContactInfo = contactInfo,
                Language = "en",
                SecondaryContactInfo = null,
                SocialSecurityNumber = "123-45-6789",
                SelectedIdentityAnswers = new Dictionary<string, string> { { "1", "2" }, { "2", "1" }, { "3", "1" } }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = false },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> { IsCompleted = true },
            };
            session.State = typeof(DomainModels.Enrollments.VerifyIdentityState);

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.Resume().Result;
                
                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
                Assert.AreEqual(0, result.Cart.Sum(l => l.OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Sum(sel => sel.Payments.RequiredAmounts.Sum(p => p.DollarAmount))));
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
        }

        [TestMethod]
        public async Task PostConfirmOrderTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();
            session.Context = new UserContext
            {
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new [] {
                            new SelectedOffer 
                            { 
                                Offer = offers[0],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                ContactInfo = contactInfo,
                Language = "en",
                SecondaryContactInfo = null,
                SelectedIdentityAnswers = new Dictionary<string, string>(),
                SocialSecurityNumber = "123-45-6789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = identityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> 
                { 
                    IsCompleted = true, 
                    Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult 
                    { 
                        Results = new DomainModels.Enrollments.Service.EnrollmentSaveEntry[0] 
                    } 
                },
            };
            session.State = typeof(DomainModels.Enrollments.CompleteOrderState);
            var request = new Models.Enrollment.ConfirmOrder
            {
                PaymentInfo = new DomainModels.Payments.TokenizedCard
                {
                    CardToken = "12345678901234567890",
                    BillingZipCode = "75010",
                    SecurityCode = "223"
                },
                AgreeToTerms = true,
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.ConfirmOrder(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.OrderConfirmed, result.ExpectedState);
                Assert.AreEqual("87654321", result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Single().ConfirmationNumber);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }


        [TestMethod]
        public async Task PostRenewalSelectedOffersTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();
            session.Context = new UserContext
            {
                IsRenewal = true,
                Services = new[] 
                {
                    new LocationServices
                    {
                        Location = specificLocation
                    }
                }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.PlanSelectionState);
            var request = new Models.Enrollment.SelectedOffers
            {
                Selection = new[] {
                    new Models.Enrollment.SelectedOfferSet { Location = specificLocation, OfferIds = new[] { "24-month-fixed-rate" } }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.SelectedOffers(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSettings, result.ExpectedState);
                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Any(o => o.OfferId == "24-month-fixed-rate"));
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Single(o => o.OfferId == "24-month-fixed-rate").OptionRules);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.LoadDespositInfoState), session.State);
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
            Assert.IsNotNull(session.InternalContext.OfferOptionRules.SingleOrDefault(e => e.Location == specificLocation && e.Offer.Id == "24-month-fixed-rate").Details);
        }

        [TestMethod]
        public void PostRenewalAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                IsRenewal = true,
                Services = new[] {
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new []
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[0]
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.LoadDespositInfoState);
            var request = new Models.Enrollment.AccountInformation
            {
                Cart = new[] {
                    new Models.Enrollment.CartEntry {
                        Location = specificLocation,
                        OfferInformationByType = new Dictionary<string,Models.Enrollment.OfferInformation>
                        {
                            {
                                offers[0].OfferType,
                                new Models.Enrollment.OfferInformation
                                {
                                    OfferSelections = new []
                                    {
                                        new Models.Enrollment.OfferSelection
                                        {
                                            OfferId = offers[0].Id,
                                            OfferOption = offerOption
                                        }
                                    }
                                }
                            }
                        }.ToArray()
                    }
                },
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.AccountInformation(request).Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PaymentInfoState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "24-month-fixed-rate"));
        }

        [TestMethod]
        public void PostRenewalConfirmOrderTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                IsRenewal = true,
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificLocation,
                        SelectedOffers = new [] {
                            new SelectedOffer 
                            { 
                                Offer = offers[0],
                                OfferOption = offerOption
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = identityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>
                {
                    IsCompleted = true,
                    Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult
                    {
                        Results = new DomainModels.Enrollments.Service.EnrollmentSaveEntry[0]
                    }
                },
                Deposit = new[] 
                { 
                    new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>
                    {
                        Location = specificLocation,
                        Offer = offers[0],
                        Details = new DomainModels.Enrollments.OfferPayment
                        {
                            RequiredAmounts = new IOfferPaymentAmount[] 
                            { 
                                new DepositOfferPaymentAmount { DollarAmount = 0 }
                            },
                            OngoingAmounts = new IOfferPaymentAmount[] { }
                        }
                    }
                },
            };
            session.State = typeof(DomainModels.Enrollments.CompleteOrderState);
            var request = new Models.Enrollment.ConfirmOrder
            {
                PaymentInfo = new DomainModels.Payments.TokenizedCard
                {
                    CardToken = "12345678901234567890",
                    BillingZipCode = "75010",
                    SecurityCode = "223"
                },
                AgreeToTerms = true,
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.ConfirmOrder(request).Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.OrderConfirmed, result.ExpectedState);
                Assert.AreEqual("87654321", result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricityOffer.Qualifier).Value.OfferSelections.Single().ConfirmationNumber);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }

    }
}
