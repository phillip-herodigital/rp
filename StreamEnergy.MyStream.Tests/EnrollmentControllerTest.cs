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
using System.Collections.Specialized;
using TexasElectricity = StreamEnergy.DomainModels.Enrollments.TexasElectricity;
using Renewal = StreamEnergy.DomainModels.Enrollments.Renewal;

namespace StreamEnergy.MyStream.Tests
{
    [TestClass]
    public class EnrollmentControllerTest
    {
        private Unity.Container container;
        private DomainModels.Enrollments.Location generalLocation;
        private DomainModels.Enrollments.Location generalLocationSwitch;
        private DomainModels.Enrollments.Location specificLocation;
        private DomainModels.Enrollments.Location specificLocationOncor;        
        private DomainModels.Enrollments.Location specificLocationSwitch;
        private Location generalCommercialLocation;
        private Location generalCommercialLocationSwitch;
        private DomainModels.Enrollments.Location specificCommercialLocation;
        private DomainModels.Enrollments.Location specificCommercialLocationSwitch;
        private IOffer[] offers;
        private IdentityQuestion[] identityQuestions;
        private DomainModels.Enrollments.Service.IdentityCheckResult identityCheckResult;
        private DomainModels.CustomerContact contactInfo;
        private TexasElectricity.OfferOption offerOption;
        private DomainModels.Enrollments.Service.IdentityCheckResult finalIdentityCheckResult;
        private DomainModels.Enrollments.Service.IdentityCheckResult finalFailedIdentityCheckResult;        
        private Mock<IEnrollmentService> mockEnrollmentService;
        private Address mailingAddress;
        private Address previousAddress;
        private Location specificRenewalLocation;
        private Renewal.OfferOption renewalOption;

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
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn } ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Residential }
                }
            };
            generalLocationSwitch = new Location
            {
                Address = new DomainModels.Address { PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch }  ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Residential }
                }
            };
            generalCommercialLocation = new Location
            {
                Address = new DomainModels.Address { PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn } ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Commercial }
                }
            };
            generalCommercialLocationSwitch = new Location
            {
                Address = new DomainModels.Address { PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch }  ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Commercial }
                }
            };
            offers = new IOffer[] 
            { 
                new TexasElectricity.Offer
                {
                    Id = "Centerpoint/24-month-fixed-rate"
                },
                new TexasElectricity.Offer
                {
                    Id = "Centerpoint/Month-to-month",
                    TermMonths = 1
                },
                new TexasElectricity.Offer
                {
                    Id = "ONCOR/24-month-fixed-rate"
                },
                new TexasElectricity.Offer
                {
                    Id = "ONCOR/Month-to-month",
                    TermMonths = 1
                },
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
                IdentityAccepted = true,
                IdentityCheckId = "01235",
                HardStop = null,
                IdentityQuestions = new IdentityQuestion[0],
            };
            finalFailedIdentityCheckResult = new DomainModels.Enrollments.Service.IdentityCheckResult
            {
                IdentityAccepted = false,
                IdentityCheckId = "01235",
                HardStop = null,
                IdentityQuestions = new IdentityQuestion[0],
            };
            specificLocation = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn }  ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Residential }
                }
            };
            specificLocationOncor = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn }  ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Residential }
                }
            };
            specificLocationSwitch = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch }  ,
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Residential }
                }
            };
            specificCommercialLocation = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.MoveIn },
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Commercial }
                }
            };
            specificCommercialLocationSwitch = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] 
                { 
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" }, 
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = EnrollmentType.Switch },
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = EnrollmentCustomerType.Commercial }
                }
            };
            specificRenewalLocation = new Location
            {
                Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                Capabilities = new IServiceCapability[] { new ServiceStatusCapability { EnrollmentType = EnrollmentType.Renewal } }
            };
            renewalOption = new Renewal.OfferOption
            {
                RenewalDate = DateTime.Today.AddDays(7)
            };
            contactInfo = new DomainModels.CustomerContact
            {
                Name = new DomainModels.Name { First = "Test", Last = "Person" },
                Email = new DomainModels.Email { Address = "test@example.com" },
                Phone = new[] { new DomainModels.TypedPhone { Number = "214-223-4567", Category = StreamEnergy.DomainModels.PhoneCategory.Home } },
            };
            offerOption = new TexasElectricity.MoveInOfferOption { ConnectDate = new DateTime(2014, 5, 1) };
            mailingAddress = new Address { Line1 = "123 Main St", City = "Dallas", StateAbbreviation = "TX", PostalCode5 = "75201" };
            previousAddress = new Address { Line1 = "123 Main St", City = "Richardson", StateAbbreviation = "TX", PostalCode5 = "75080" };

            var enrollmentService = (IEnrollmentService)container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            mockEnrollmentService.Setup(m => m.BeginSaveEnrollment(It.IsAny<Guid>(), It.IsAny<UserContext>(), It.IsAny<NameValueCollection>())).Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>()
                {
                    IsCompleted = false
                }));

            mockEnrollmentService.Setup(m => m.BeginSaveUpdateEnrollment(It.IsAny<Guid>(), It.IsAny<DomainModels.Enrollments.Service.EnrollmentSaveResult>(), It.IsAny<UserContext>(), It.IsAny<NameValueCollection>(), It.IsAny<IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<OfferPayment>>>())).Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>()
            {
                IsCompleted = false
            }));

            mockEnrollmentService.Setup(m => m.EndSaveEnrollment(It.IsAny<StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>>(), It.IsAny<UserContext>())).Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>()
            {
                Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult 
                { 
                    Results = new[] 
                    {
                        new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.EnrollmentSaveEntry>
                        {
                            Location = specificLocation,
                            Offer = offers.First(o => o.Id == "Centerpoint/24-month-fixed-rate"),
                            Details = new DomainModels.Enrollments.Service.EnrollmentSaveEntry 
                            { 
                                StreamReferenceNumber = "stream",
                                GlobalEnrollmentAccountId = Guid.NewGuid(),
                            }
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

            var creditCheckResult = new StreamAsync<CreditCheckResult>
            {
                IsCompleted = false,
            };
            mockAccountService.Setup(m => m.CreateStreamConnectCustomer(It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()))
                .Returns(Task.FromResult(new StreamEnergy.DomainModels.Accounts.Customer { GlobalCustomerId = Guid.NewGuid() }));
            mockEnrollmentService.Setup(m => m.BeginCreditCheck(It.IsAny<Guid>(), It.IsAny<Name>(), It.IsAny<string>(), It.IsAny<Address>())).Returns(Task.FromResult(creditCheckResult));
            mockEnrollmentService.Setup(m => m.EndCreditCheck(creditCheckResult)).Returns(Task.FromResult(new StreamAsync<CreditCheckResult>
                {
                    IsCompleted = true
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
            mockEnrollmentService.Setup(m => m.LoadOfferPayments(It.IsAny<Guid>(), It.IsAny<DomainModels.Enrollments.Service.EnrollmentSaveResult>(), It.IsAny<IEnumerable<LocationServices>>(), It.IsAny<InternalContext>())).Returns<Guid, DomainModels.Enrollments.Service.EnrollmentSaveResult, IEnumerable<LocationServices>, InternalContext>((a, b, services, ctx) =>
                {
                    return Task.FromResult(from loc in services
                                           from offer in loc.SelectedOffers
                                           select new DomainModels.Enrollments.Service.LocationOfferDetails<OfferPayment>
                                           {
                                               Location = loc.Location,
                                               Offer = offer.Offer,
                                               Details = new OfferPayment
                                               {
                                                   RequiredAmounts = new IOfferPaymentAmount[] 
                                                   { 
                                                       new DepositOfferPaymentAmount { DollarAmount = (!ctx.IdentityCheck.Data.IdentityAccepted || (offer.Offer is TexasElectricity.Offer && ((TexasElectricity.Offer)offer.Offer).TermMonths == 1)) ? 0 : 75.25m }
                                                   },
                                                   OngoingAmounts = new IOfferPaymentAmount[] { },
                                                   PostBilledAmounts = new IOfferPaymentAmount[] { },
                                               }
                                           });
                });
            mockEnrollmentService.Setup(m => m.PlaceOrder(It.IsAny<IEnumerable<LocationServices>>(), It.IsAny<Dictionary<AdditionalAuthorization, bool>>(), It.IsAny<DomainModels.Enrollments.InternalContext>()))
                .Returns(Task.FromResult<IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>>>(new[] 
                {
                    new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>
                    {
                        Offer = offers.First(),
                        Location = specificLocation,
                        Details = new DomainModels.Enrollments.Service.PlaceOrderResult
                        {
                            ConfirmationNumber = "87654321",
                            IsSuccess = true
                        }
                    }
                }));
            mockEnrollmentService.Setup(m => m.PlaceCommercialQuotes(It.IsAny<UserContext>())).Returns<UserContext>(uc =>
                {
                    return Task.FromResult(new DomainModels.Enrollments.Service.PlaceOrderResult 
                    {
                        ConfirmationNumber = "87654321",
                        IsSuccess = true
                    });
                });

            mockEnrollmentService.Setup(s => s.LoadOffers(It.IsAny<IEnumerable<Location>>()))
                .Returns<IEnumerable<Location>>(locations => Task.FromResult(locations.ToDictionary(location => location, location =>
            {
                var tdus = location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Select(c => c.Tdu);
                return new LocationOfferSet { Offers = offers.Where(offer => tdus.Any(tdu => offer.Id.StartsWith(tdu + "/"))).ToArray() };
            })));
            mockEnrollmentService.Setup(m => m.LoadConnectDates(It.IsAny<Location>(), It.IsAny<IOffer>())).Returns(Task.FromResult<IConnectDatePolicy>(new ConnectDatePolicy() { AvailableConnectDates = new ConnectDate[] { } }));

            mockEnrollmentService.Setup(m => m.BeginRenewal(It.IsAny<DomainModels.Accounts.Account>(), It.IsAny<DomainModels.Enrollments.Renewal.OfferOption>()))
                .Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.RenewalResult>()
                {
                    IsCompleted = false
                }));
            mockEnrollmentService.Setup(m => m.EndRenewal(It.IsAny<StreamAsync<DomainModels.Enrollments.RenewalResult>>()))
                .Returns(Task.FromResult(new StreamAsync<DomainModels.Enrollments.RenewalResult>()
                {
                    Data = new DomainModels.Enrollments.RenewalResult
                    {
                        ConfirmationNumber = "88664422",
                        IsSuccess = true
                    },
                    IsCompleted = true
                }));
            
        }

        #region General

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

        #endregion

        #region Residential

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
                Assert.AreEqual(DomainModels.Enrollments.TexasElectricity.ServiceCapability.Qualifier, result.Cart.Single().Location.Capabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.Cart.Single().Location.Capabilities.First() as DomainModels.Enrollments.TexasElectricity.ServiceCapability).Tdu);

                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.AvailableOffers.Any());
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.AvailableOffers.SingleOrDefault(offer => offer.Id == "Centerpoint/24-month-fixed-rate"));
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
            Assert.AreEqual("75010", session.Context.Services.First().Location.Address.PostalCode5);
            Assert.AreEqual(DomainModels.Enrollments.TexasElectricity.ServiceCapability.Qualifier, session.Context.Services.First().Location.Capabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.Context.Services.First().Location.Capabilities.First() as DomainModels.Enrollments.TexasElectricity.ServiceCapability).Tdu);
            Assert.IsNotNull(session.InternalContext.AllOffers[session.Context.Services.First().Location].Offers.SingleOrDefault(offer => offer.Id == "Centerpoint/24-month-fixed-rate"));
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
                    new Models.Enrollment.SelectedOfferSet { Location = specificLocation, OfferIds = new[] { "Centerpoint/24-month-fixed-rate" } }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();
                
                // Act
                var result = await controller.SelectedOffers(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSettings, result.ExpectedState);
                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Any(o => o.OfferId == "Centerpoint/24-month-fixed-rate"));
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single(o => o.OfferId == "Centerpoint/24-month-fixed-rate").OptionRules);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.AccountInformationState), session.State);
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.IsNotNull(session.InternalContext.OfferOptionRules.SingleOrDefault(e => e.Location == specificLocation && e.Offer.Id == "Centerpoint/24-month-fixed-rate").Details);
        }

        [TestMethod]
        public async Task PostSelectedOffersChangeTduTest()
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
                    new Models.Enrollment.SelectedOfferSet { Location = specificLocationOncor, OfferIds = new[] { "Centerpoint/24-month-fixed-rate" } }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.SelectedOffers(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSelection, result.ExpectedState);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
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
                SelectedIdentityAnswers = new Dictionary<string,string>()
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
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("123456789", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(3, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
            Assert.IsNotNull(session.InternalContext.CreditCheck);
            Assert.IsTrue(session.InternalContext.CreditCheck.IsCompleted);
            Assert.IsNull(session.Context.SelectedIdentityAnswers);
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
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("123456789", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(3, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
            Assert.IsNotNull(session.InternalContext.CreditCheck);
            Assert.IsTrue(session.InternalContext.CreditCheck.IsCompleted);
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

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("333224444", session.Context.SocialSecurityNumber);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNotNull(session.InternalContext.IdentityCheck.Data.IdentityQuestions);
            Assert.AreEqual(0, session.InternalContext.IdentityCheck.Data.IdentityQuestions.Length);
            Assert.IsNotNull(session.InternalContext.CreditCheck);
            Assert.IsTrue(session.InternalContext.CreditCheck.IsCompleted);
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
        public void ResumePostIdentityQuestionsFailedTest()
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

            mockEnrollmentService.Setup(m => m.EndIdentityCheck(It.IsAny<DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>>())).Returns(Task.FromResult(new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult>
            {
                IsCompleted = true,
                Data = finalFailedIdentityCheckResult
            }));

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();
                
                // Act
                var result = controller.Resume().Result;

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
                Assert.IsFalse(result.IdentityQuestions.Any());
                Assert.AreEqual(0, result.Cart.Sum(l => l.OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Sum(sel => sel.Payments.RequiredAmounts.Sum(p => p.DollarAmount))));
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
            Assert.AreEqual(0, session.Context.SelectedIdentityAnswers.Count);
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
                Assert.AreEqual(75.25m, result.Cart.Sum(l => l.OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Sum(sel => sel.Payments.RequiredAmounts.Sum(p => p.DollarAmount))));
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.PaymentInfoState), session.State);
            Assert.AreEqual(0, session.Context.SelectedIdentityAnswers.Count);
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
                Assert.AreEqual(0, result.Cart.Sum(l => l.OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Sum(sel => sel.Payments.RequiredAmounts.Sum(p => p.DollarAmount))));
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
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = finalIdentityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult> 
                { 
                    IsCompleted = true, 
                    Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult 
                    {
                        Results = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.EnrollmentSaveEntry>[0] 
                    } 
                },
            };
            session.State = typeof(DomainModels.Enrollments.PaymentInfoState);
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
                Assert.AreEqual("87654321", result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single().ConfirmationNumber);
                Assert.AreEqual(true, result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single().ConfirmationSuccess);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }

        [TestMethod]
        public async Task PostConfirmOrderWaiveDepositTest()
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
                IdentityCheck = new StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { IsCompleted = true, Data = finalIdentityCheckResult },
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>
                {
                    IsCompleted = true,
                    Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult
                    {
                        Results = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.EnrollmentSaveEntry>[0]
                    }
                },
                Deposit = new[] 
                { 
                    new StreamEnergy.DomainModels.Enrollments.Service.LocationOfferDetails<OfferPayment> { Location = specificLocation, Offer = offers[0], Details = new OfferPayment { RequiredAmounts = new [] { new DepositOfferPaymentAmount { DollarAmount = 250 } } } }
                }
            };
            session.State = typeof(DomainModels.Enrollments.PaymentInfoState);
            var request = new Models.Enrollment.ConfirmOrder
            {
                PaymentInfo = null,
                AgreeToTerms = true,
                DepositWaivers = new[] { new Models.Enrollment.DepositWaiver { Location = specificLocation, OfferId = offers[0].Id } }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.ConfirmOrder(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.OrderConfirmed, result.ExpectedState);
                Assert.AreEqual("87654321", result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single().ConfirmationNumber);
                Assert.AreEqual(false, result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single().ConfirmationSuccess);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }

        #endregion

        #region Commercial

        [TestMethod]
        public async Task CommercialPostServiceInformationTest()
        {
            // Arrange
            var request = new Models.Enrollment.ServiceInformation
            {
                Locations = new[]
                { 
                    generalCommercialLocation
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
                Assert.AreEqual(DomainModels.Enrollments.TexasElectricity.ServiceCapability.Qualifier, result.Cart.Single().Location.Capabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.Cart.Single().Location.Capabilities.First() as DomainModels.Enrollments.TexasElectricity.ServiceCapability).Tdu);

                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.AvailableOffers.Any());
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.AvailableOffers.SingleOrDefault(offer => offer.Id == "Centerpoint/24-month-fixed-rate"));
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            await session.EnsureInitialized();

            Assert.AreEqual(typeof(DomainModels.Enrollments.PlanSelectionState), session.State);
            Assert.AreEqual("75010", session.Context.Services.First().Location.Address.PostalCode5);
            Assert.AreEqual(DomainModels.Enrollments.TexasElectricity.ServiceCapability.Qualifier, session.Context.Services.First().Location.Capabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.Context.Services.First().Location.Capabilities.First() as DomainModels.Enrollments.TexasElectricity.ServiceCapability).Tdu);
            Assert.IsNotNull(session.InternalContext.AllOffers[session.Context.Services.First().Location].Offers.SingleOrDefault(offer => offer.Id == "Centerpoint/24-month-fixed-rate"));
        }

        [TestMethod]
        public async Task CommercialPostSelectedOffersTest()
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
                        Location = generalCommercialLocation
                    }
                }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalCommercialLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.PlanSelectionState);
            var request = new Models.Enrollment.SelectedOffers
            {
                Selection = new[] {
                    new Models.Enrollment.SelectedOfferSet { Location = specificCommercialLocation, OfferIds = new[] { "Centerpoint/24-month-fixed-rate" } }
                }
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                await controller.Initialize();

                // Act
                var result = await controller.SelectedOffers(request);

                // Assert
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.PlanSettings, result.ExpectedState);
                Assert.IsTrue(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Any(o => o.OfferId == "Centerpoint/24-month-fixed-rate"));
                Assert.IsNotNull(result.Cart.Single().OfferInformationByType.First(e => e.Key == TexasElectricity.Offer.Qualifier).Value.OfferSelections.Single(o => o.OfferId == "Centerpoint/24-month-fixed-rate").OptionRules);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.AccountInformationState), session.State);
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.IsNotNull(session.InternalContext.OfferOptionRules.SingleOrDefault(e => e.Location == specificCommercialLocation && e.Offer.Id == "Centerpoint/24-month-fixed-rate").Details);
        }

        [TestMethod]
        public void CommercialPostAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                Services = new[] {
                    new LocationServices
                    {
                        Location = generalCommercialLocation,
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
                AllOffers = new Dictionary<Location, LocationOfferSet> { { generalCommercialLocation, new LocationOfferSet { Offers = offers } } }
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                ContactInfo = contactInfo,
                DriversLicense = null,
                Language = "en",
                SecondaryContactInfo = null,
                TaxId = "12-3456789",
                MailingAddress = mailingAddress,
                PreviousAddress = previousAddress,
                Cart = new[] {
                    new Models.Enrollment.CartEntry {
                        Location = specificCommercialLocation,
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
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.ReviewOrder, result.ExpectedState);
                Assert.AreEqual("Test", result.ContactInfo.Name.First);
                Assert.AreEqual("Person", result.ContactInfo.Name.Last);
                Assert.AreEqual("test@example.com", result.ContactInfo.Email.Address);
                Assert.AreEqual("2142234567", result.ContactInfo.Phone[0].Number);
                Assert.IsNull(result.IdentityQuestions);
                Assert.AreEqual("en", result.Language);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificCommercialLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == "Centerpoint/24-month-fixed-rate"));
            Assert.AreEqual("Test", session.Context.ContactInfo.Name.First);
            Assert.AreEqual("Person", session.Context.ContactInfo.Name.Last);
            Assert.AreEqual("test@example.com", session.Context.ContactInfo.Email.Address);
            Assert.AreEqual("2142234567", session.Context.ContactInfo.Phone[0].Number);
            Assert.AreEqual("123456789", session.Context.TaxId);
            Assert.AreEqual("en", session.Context.Language);
            Assert.IsNull(session.InternalContext.IdentityCheck);
            Assert.IsNull(session.InternalContext.CreditCheck);
        }

        [TestMethod]
        public async Task CommercialPostConfirmOrderTest()
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
                        Location = specificCommercialLocation,
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
                SocialSecurityNumber = "12-3456789",
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> { { specificCommercialLocation, new LocationOfferSet { Offers = offers } } },
                IdentityCheck = null,
                EnrollmentSaveState = new StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>
                {
                    IsCompleted = true,
                    Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult
                    {
                        Results = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.EnrollmentSaveEntry>[0]
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
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }

        #endregion

        #region Renewal

        [TestMethod]
        public void PostRenewalAccountInformationTest()
        {
            // Arrange
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            mockEnrollmentService.Setup(m => m.LoadOfferPayments(It.IsAny<Guid>(), It.IsAny<DomainModels.Enrollments.Service.EnrollmentSaveResult>(), It.IsAny<IEnumerable<LocationServices>>(), It.IsAny<InternalContext>())).Returns<Guid, DomainModels.Enrollments.Service.EnrollmentSaveResult, IEnumerable<LocationServices>, InternalContext>((a, b, services, ctx) =>
            {
                return Task.FromResult(from loc in services
                                       from offer in loc.SelectedOffers
                                       select new DomainModels.Enrollments.Service.LocationOfferDetails<OfferPayment>
                                       {
                                           Location = loc.Location,
                                           Offer = offer.Offer,
                                           Details = new OfferPayment
                                           {
                                               RequiredAmounts = new IOfferPaymentAmount[] 
                                                   { 
                                                       new DepositOfferPaymentAmount { DollarAmount = 0 }
                                                   },
                                               OngoingAmounts = new IOfferPaymentAmount[] { },
                                               PostBilledAmounts = new IOfferPaymentAmount[] { },
                                           }
                                       });
            });

            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                IsRenewal = true,
                Services = new[] 
                {
                    new LocationServices
                    {
                        Location = specificRenewalLocation,
                        SelectedOffers = new SelectedOffer[] 
                        { 
                            new SelectedOffer 
                            { 
                                Offer = new DomainModels.Enrollments.Renewal.Offer 
                                { 
                                    RenewingAccount = new DomainModels.Accounts.Account(Guid.Empty, Guid.Empty) 
                                    { 
                                    } 
                                } 
                            }
                        }
                    }
                }
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = new Dictionary<Location, LocationOfferSet> 
                { 
                    { 
                        specificRenewalLocation, new LocationOfferSet 
                        { 
                            Offers = new IOffer[]
                            {
                                new DomainModels.Enrollments.Renewal.Offer 
                                { 
                                    RenewingAccount = new DomainModels.Accounts.Account(Guid.Empty, Guid.Empty)
                                } 
                            }
                        } 
                    }
                }
            };
            session.State = typeof(DomainModels.Enrollments.AccountInformationState);
            var request = new Models.Enrollment.AccountInformation
            {
                Cart = new[] 
                {
                    new Models.Enrollment.CartEntry 
                    {
                        Location = specificRenewalLocation,
                        OfferInformationByType = new Dictionary<string,Models.Enrollment.OfferInformation>
                        {
                            {
                                "Renewal",
                                new Models.Enrollment.OfferInformation
                                {
                                    OfferSelections = new []
                                    {
                                        new Models.Enrollment.OfferSelection
                                        {
                                            OfferId = "",
                                            OfferOption = renewalOption
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

            Assert.AreEqual(typeof(DomainModels.Enrollments.CompleteOrderState), session.State);
            Assert.IsTrue(session.InternalContext.AllOffers.ContainsKey(specificRenewalLocation));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.Any(o => o.Offer.Id == ""));
            Assert.IsTrue(session.Context.Services.First().SelectedOffers.First().OfferOption is DomainModels.Enrollments.Renewal.OfferOption);
        }

        [TestMethod]
        public void PostRenewalConfirmOrderTest()
        {
            // Arrange
            var offers = new Dictionary<Location, LocationOfferSet> 
                { 
                    { 
                        specificRenewalLocation, new LocationOfferSet 
                        { 
                            Offers = new IOffer[]
                            {
                                new DomainModels.Enrollments.Renewal.Offer 
                                { 
                                    RenewingAccount = new DomainModels.Accounts.Account(Guid.Empty, Guid.Empty)
                                } 
                            }
                        } 
                    }
                };
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                IsRenewal = true,
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificRenewalLocation,
                        SelectedOffers = new SelectedOffer[] 
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[specificRenewalLocation].Offers.First(),
                                OfferOption = renewalOption
                            }
                        }
                    }
                },
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheck = null,
                EnrollmentSaveState = null,
                Deposit = null,
            };
            session.State = typeof(DomainModels.Enrollments.CompleteOrderState);
            var request = new Models.Enrollment.ConfirmOrder
            {
                AgreeToTerms = true,
            };

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.ConfirmOrder(request).Result;

                // Assert
                Assert.AreEqual(true, result.IsLoading);
            }

            Assert.IsNotNull(session.InternalContext.RenewalResult);
            Assert.IsFalse(session.InternalContext.RenewalResult.IsCompleted);
            Assert.AreEqual(typeof(DomainModels.Enrollments.PlaceOrderState), session.State);
        }

        [TestMethod]
        public void PostRenewalResumeConfirmOrderTest()
        {
            // Arrange
            var offers = new Dictionary<Location, LocationOfferSet> 
                { 
                    { 
                        specificRenewalLocation, new LocationOfferSet 
                        { 
                            Offers = new IOffer[]
                            {
                                new DomainModels.Enrollments.Renewal.Offer 
                                { 
                                    RenewingAccount = new DomainModels.Accounts.Account(Guid.Empty, Guid.Empty)
                                } 
                            }
                        } 
                    }
                };
            var session = container.Resolve<EnrollmentController.SessionHelper>();
            session.EnsureInitialized().Wait();
            session.Context = new UserContext
            {
                AdditionalAuthorizations = new Dictionary<AdditionalAuthorization,bool>(),
                IsRenewal = true,
                Services = new[]
                { 
                    new LocationServices
                    {
                        Location = specificRenewalLocation,
                        SelectedOffers = new SelectedOffer[] 
                        { 
                            new SelectedOffer 
                            { 
                                Offer = offers[specificRenewalLocation].Offers.First(),
                                OfferOption = renewalOption
                            }
                        }
                    }
                },
                AgreeToTerms = true
            };
            session.InternalContext = new InternalContext
            {
                AllOffers = offers,
                IdentityCheck = null,
                EnrollmentSaveState = null,
                Deposit = null,
                RenewalResult = new StreamAsync<RenewalResult>
                {
                    IsCompleted = false
                }
            };
            session.State = typeof(DomainModels.Enrollments.PlaceOrderState);

            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Initialize().Wait();

                // Act
                var result = controller.Resume().Result;

                // Assert
                Assert.AreEqual(false, result.IsLoading);
                Assert.AreEqual(MyStream.Models.Enrollment.ExpectedState.OrderConfirmed, result.ExpectedState);
                Assert.AreEqual("88664422", result.Cart.Single().OfferInformationByType.First(e => e.Key == Renewal.Offer.Qualifier).Value.OfferSelections.Single().ConfirmationNumber);
            }

            Assert.AreEqual(typeof(DomainModels.Enrollments.OrderConfirmationState), session.State);
        }
        #endregion
    }
}
