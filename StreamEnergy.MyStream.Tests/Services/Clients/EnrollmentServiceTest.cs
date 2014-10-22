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
    public class EnrollmentServiceTest
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
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void GetProductsZipTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            // Act
            Dictionary<DomainModels.Enrollments.Location, DomainModels.Enrollments.LocationOfferSet> result;
            using (new Timer())
            {
                result = enrollmentService.LoadOffers(new[] 
                { 
                    new DomainModels.Enrollments.Location
                    {
                        Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                    }
                }).Result;
            }
            
            // Assert
            if (result.First().Value.Offers.Any())
            {

            }
            else
            {
                Assert.Inconclusive("No data from Stream Connect");
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void GetProductsAddressTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            // Act
            Dictionary<DomainModels.Enrollments.Location, DomainModels.Enrollments.LocationOfferSet> result;
            using (new Timer())
            {
                result = enrollmentService.LoadOffers(new[] 
                { 
                    new DomainModels.Enrollments.Location
                    {
                        Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                    }
                }).Result;
            }

            // Assert
            if (result.First().Value.Offers.Any())
            {

            }
            else
            {
                Assert.Inconclusive("No data from Stream Connect");
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void GetMoveInDatesTest()
        {
            // Assign
            var location = new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                        new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                        new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                    }
                };
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;

            // Act
            DomainModels.Enrollments.IConnectDatePolicy connectDates;
            using (new Timer())
            {
                connectDates = enrollmentService.LoadConnectDates(location, offers.Single().Value.Offers.First()).Result;
            }

            // Assert
            Assert.IsTrue(connectDates.AvailableConnectDates.Any());
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        public void PostVerificationsIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;

            using (new Timer())
            {
                // Act
                var firstCheck = enrollmentService.BeginIdentityCheck(gcid,
                    name: TestData.IdentityCheckName(),
                    ssn: TestData.IdentityCheckSsn,
                    mailingAddress: TestData.IdentityCheckMailingAddress()).Result;

                // Assert
                Assert.IsNotNull(firstCheck);
                Assert.IsTrue(firstCheck.IsCompleted);
                Assert.IsNotNull(firstCheck.Data.IdentityCheckId);

                // Since we're really verifying the API, not actually testing our code, there's no reason to follow the AAA test standard.
                // Don't take this as an example of OK - this should be multiple tests, with either initial setup or in the "assign" section.

                // Act - Step 2
                var secondCheck = enrollmentService.BeginIdentityCheck(gcid,
                    name: TestData.IdentityCheckName(),
                    ssn: TestData.IdentityCheckSsn,
                    mailingAddress: TestData.IdentityCheckMailingAddress(),
                    identityInformation: new DomainModels.Enrollments.AdditionalIdentityInformation
                    {
                        PreviousIdentityCheckId = firstCheck.Data.IdentityCheckId,
                        SelectedAnswers = firstCheck.Data.IdentityQuestions.ToDictionary(q => q.QuestionId, q => q.Answers[0].AnswerId)
                    }).Result;

                // Assert
                Assert.IsNotNull(secondCheck);
                Assert.IsFalse(secondCheck.IsCompleted);

                // Act - Step 3 - async response
                do
                {
                    secondCheck = enrollmentService.EndIdentityCheck(secondCheck).Result;
                } while (!secondCheck.IsCompleted);

                // Assert
                Assert.IsTrue(secondCheck.IsCompleted);
                Assert.AreEqual(0, secondCheck.Data.IdentityQuestions.Length);
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        public void PostVerificationsCreditTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;

            using (new Timer())
            {
                // Act - Step 1
                var creditCheck = enrollmentService.BeginCreditCheck(gcid,
                    name: TestData.CreditCheckContactInfo().Name,
                    ssn: "123456789",
                    address: TestData.CreditCheckAddress()).Result;

                // Assert
                Assert.IsNotNull(creditCheck);
                Assert.IsFalse(creditCheck.IsCompleted);

                // Act - Step 2 - async response
                do
                {
                    creditCheck = enrollmentService.EndCreditCheck(creditCheck).Result;
                } while (!creditCheck.IsCompleted);

                // Assert
                Assert.IsTrue(creditCheck.IsCompleted);
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void LoadOfferPaymentsTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
            {
                Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                Capabilities = new DomainModels.IServiceCapability[]
                {
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                }
            };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
            {
                ContactInfo = TestData.CreditCheckContactInfo(),
                SocialSecurityNumber = TestData.CreditCheckSsn,
                Services = new DomainModels.Enrollments.LocationServices[]
                {
                    new DomainModels.Enrollments.LocationServices 
                    { 
                        Location = location, 
                        SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                        {
                            new DomainModels.Enrollments.SelectedOffer
                            {
                                Offer = texasElectricityOffer,
                                OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                { 
                                    ConnectDate = DateTime.Today.AddDays(3),
                                }
                            }
                        }
                    }
                },
                MailingAddress = new DomainModels.Address
                {
                    City = "MASSENA",
                    StateAbbreviation = "NY",
                    Line1 = "100 WILSON HILL RD",
                    PostalCode5 = "13662"
                },
            };
            Mock<DomainModels.Enrollments.IOfferOptionRules> mockRules = new Mock<DomainModels.Enrollments.IOfferOptionRules>();
            mockRules.Setup(r => r.GetPostBilledPayments(It.IsAny<DomainModels.Enrollments.IOfferOption>())).Returns(new DomainModels.Enrollments.IOfferPaymentAmount[0]);
            var internalContext = new DomainModels.Enrollments.InternalContext
                    {
                        OfferOptionRules = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>[] 
                        { 
                            new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>
                            {
                                Location = location,
                                Offer = texasElectricityOffer,
                                Details = mockRules.Object
                            }
                        }
                    };
            var saveResult = enrollmentService.BeginSaveEnrollment(gcid, userContext, null).Result;
            while (!saveResult.IsCompleted)
            {
                saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
            }

            var creditCheck = enrollmentService.BeginCreditCheck(gcid,
                name: TestData.CreditCheckContactInfo().Name,
                ssn: TestData.CreditCheckSsn,
                address: TestData.CreditCheckAddress()).Result;
            do
            {
                creditCheck = enrollmentService.EndCreditCheck(creditCheck).Result;
            } while (!creditCheck.IsCompleted);

            internalContext.IdentityCheck = new DomainModels.StreamAsync<DomainModels.Enrollments.Service.IdentityCheckResult> { Data = new DomainModels.Enrollments.Service.IdentityCheckResult { IdentityAccepted = true }, IsCompleted = true };

            using (new Timer())
            {
                // Act
                var offerPayments = enrollmentService.LoadOfferPayments(gcid, saveResult.Data, userContext.Services, internalContext).Result;

                // Assert
                Assert.IsNotNull(offerPayments);
                var offerPayment = offerPayments.Single();
                Assert.IsTrue(offerPayment.Details.RequiredAmounts.OfType<DomainModels.Enrollments.DepositOfferPaymentAmount>().Single().DollarAmount >= 0);
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostVerifyPremiseTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            using (new Timer())
            {
                // Act
                var result = enrollmentService.VerifyPremise(new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                }).Result;

                // Assert
                Assert.AreEqual(DomainModels.Enrollments.PremiseVerificationResult.Success, result);
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Commercial Enrollments")]
        public void PostEnrollmentsCommercial()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            
            using (new Timer())
            {
                // Act
                var result = enrollmentService.PlaceCommercialQuotes(new DomainModels.Enrollments.UserContext
                    {
                        ContactInfo = new DomainModels.CustomerContact
                        {
                            Name = new DomainModels.Name { First = "Test", Last = "Person" },
                            Email = new DomainModels.Email { Address = "test@example.com" },
                            Phone = new[] { 
                                new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Work, Number = "223-456-7890" }
                            },
                        },
                        ContactTitle = "Founder",
                        SocialSecurityNumber = "123456789",
                        MailingAddress = new DomainModels.Address
                        {
                            Line1 = "123 Main St",
                            City = "Dallas",
                            StateAbbreviation = "TX",
                            PostalCode5 = "75201"
                        },
                        Language = "en",
                        PreferredSalesExecutive = "John Smith",
                        TaxId = "98-7654321",
                        DoingBusinessAs = "Some Business",
                        Services = new DomainModels.Enrollments.LocationServices[]
                        {
                            new DomainModels.Enrollments.LocationServices 
                            { 
                                Location = new DomainModels.Enrollments.Location
                                {
                                    Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010", },
                                    Capabilities = new DomainModels.IServiceCapability[]
                                    {
                                        new DomainModels.Enrollments.TexasElectricity.ServiceCapability 
                                        { 
                                            Address = "03620     HUFFINES                    BLVD",
                                            AddressOverflow = "",
                                            City = "CARROLLTON",
                                            EsiId = "10443720006156949",
                                            MeterType = DomainModels.Enrollments.TexasElectricity.MeterType.Amsm,
                                            State = "TX",
                                            Tdu = "ONCOR ELEC",
                                            Zipcode = "750106446"
                                        },
                                        new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                                        new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Commercial },
                                    }
                                }, 
                            }
                        }
                    }).Result;

                // Assert
                Assert.IsTrue(result.IsSuccess);
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostEnrollmentsCreate()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
                    {
                        Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                    };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
                {
                    ContactInfo = TestData.CreditCheckContactInfo(),
                    SocialSecurityNumber = TestData.CreditCheckSsn,
                    Services = new DomainModels.Enrollments.LocationServices[]
                    {
                        new DomainModels.Enrollments.LocationServices 
                        { 
                            Location = location, 
                            SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                            {
                                new DomainModels.Enrollments.SelectedOffer
                                {
                                    Offer = texasElectricityOffer,
                                    OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                    { 
                                        ConnectDate = DateTime.Today.AddDays(3),
                                    }
                                }
                            }
                        }
                    },
                    MailingAddress = new DomainModels.Address
                    {
                        City = "MASSENA",
                        StateAbbreviation = "NY",
                        Line1 = "100 WILSON HILL RD",
                        PostalCode5 = "13662"
                    },
                };

            using (new Timer())
            {
                // Act
                var saveResult = enrollmentService.BeginSaveEnrollment(globalCustomerId, userContext, null).Result;

                // Assert
                Assert.IsFalse(saveResult.IsCompleted);
                Assert.IsNotNull(saveResult.ResponseLocation);

                // Act - Step 3 - async response
                while (!saveResult.IsCompleted)
                {
                    saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
                }

                // Assert
                Assert.IsTrue(saveResult.IsCompleted);
                if (saveResult.Data.Results.Length > 0)
                {
                    Assert.IsTrue(saveResult.Data.Results.All(r => !string.IsNullOrEmpty(r.Details.StreamReferenceNumber)));
                    foreach (var r in saveResult.Data.Results)
                    {
                        enrollmentService.DeleteEnrollment(globalCustomerId, r.Details.GlobalEnrollmentAccountId).Wait();
                    }
                }
                else
                {
                    Assert.Fail("No data from Stream Connect");
                }
            }
        }


        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostEnrollmentsUpdate()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
            {
                Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
            };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
            {
                ContactInfo = TestData.CreditCheckContactInfo(),
                SocialSecurityNumber = TestData.CreditCheckSsn,
                Services = new DomainModels.Enrollments.LocationServices[]
                    {
                        new DomainModels.Enrollments.LocationServices 
                        { 
                            Location = location, 
                            SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                            {
                                new DomainModels.Enrollments.SelectedOffer
                                {
                                    Offer = texasElectricityOffer,
                                    OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                    { 
                                        ConnectDate = DateTime.Today.AddDays(3),
                                    }
                                }
                            }
                        }
                    },
                MailingAddress = new DomainModels.Address
                {
                    City = "MASSENA",
                    StateAbbreviation = "NY",
                    Line1 = "100 WILSON HILL RD",
                    PostalCode5 = "13662"
                },
            };

            var saveResult = enrollmentService.BeginSaveEnrollment(globalCustomerId, userContext, null).Result;

            Assert.IsFalse(saveResult.IsCompleted);
            Assert.IsNotNull(saveResult.ResponseLocation);

            while (!saveResult.IsCompleted)
            {
                saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
            }

            userContext.ContactInfo = new DomainModels.CustomerContact
                {
                    Name = new DomainModels.Name
                    {
                        First = "REBECCA",
                        Last = "DELEON"
                    },
                    Phone = new DomainModels.Phone[] { new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = "2230987654" } },
                    Email = new DomainModels.Email { Address = "test@example.com" },
                };

            using (new Timer())
            {
                // Act
                saveResult = enrollmentService.BeginSaveUpdateEnrollment(globalCustomerId, saveResult.Data, userContext, null, null).Result;

                // Assert
                Assert.IsFalse(saveResult.IsCompleted);
                Assert.IsNotNull(saveResult.ResponseLocation);

                // Act - Step 2 - async response
                while (!saveResult.IsCompleted)
                {
                    saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
                }

                // Assert
                Assert.IsTrue(saveResult.IsCompleted);
                if (saveResult.Data.Results.Length > 0)
                {

                }
                else
                {
                    Assert.Fail("No data from Stream Connect");
                }
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostEnrollmentsUpsert()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
            {
                Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
            };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
            {
                ContactInfo = TestData.CreditCheckContactInfo(),
                SocialSecurityNumber = TestData.CreditCheckSsn,
                Services = new DomainModels.Enrollments.LocationServices[]
                    {
                        new DomainModels.Enrollments.LocationServices 
                        { 
                            Location = location, 
                            SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                            {
                                new DomainModels.Enrollments.SelectedOffer
                                {
                                    Offer = texasElectricityOffer,
                                    OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                    { 
                                        ConnectDate = DateTime.Today.AddDays(3),
                                    }
                                }
                            }
                        }
                    },
                MailingAddress = new DomainModels.Address
                {
                    City = "MASSENA",
                    StateAbbreviation = "NY",
                    Line1 = "100 WILSON HILL RD",
                    PostalCode5 = "13662"
                },
            };

            var saveResult = new DomainModels.StreamAsync<DomainModels.Enrollments.Service.EnrollmentSaveResult>
            {
                Data = new DomainModels.Enrollments.Service.EnrollmentSaveResult { Results = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.EnrollmentSaveEntry>[0] },
                IsCompleted = true,
            };

            using (new Timer())
            {
                // Act
                saveResult = enrollmentService.BeginSaveUpdateEnrollment(globalCustomerId, saveResult.Data, userContext, null, null).Result;

                // Assert
                Assert.IsFalse(saveResult.IsCompleted);
                Assert.IsNotNull(saveResult.ResponseLocation);

                // Act - Step 2 - async response
                while (!saveResult.IsCompleted)
                {
                    saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
                }

                // Assert
                Assert.IsTrue(saveResult.IsCompleted);
                if (saveResult.Data.Results.Length > 0)
                {

                }
                else
                {
                    Assert.Fail("No data from Stream Connect");
                }
            }
        }

        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostEnrollmentsFinalize()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
            {
                Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
            };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
            {
                ContactInfo = TestData.CreditCheckContactInfo(),
                SocialSecurityNumber = TestData.CreditCheckSsn,
                Services = new DomainModels.Enrollments.LocationServices[]
                    {
                        new DomainModels.Enrollments.LocationServices 
                        { 
                            Location = location, 
                            SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                            {
                                new DomainModels.Enrollments.SelectedOffer
                                {
                                    Offer = texasElectricityOffer,
                                    OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                    { 
                                        ConnectDate = DateTime.Today.AddDays(3),
                                    }
                                }
                            }
                        }
                    },
                MailingAddress = new DomainModels.Address
                {
                    City = "MASSENA",
                    StateAbbreviation = "NY",
                    Line1 = "100 WILSON HILL RD",
                    PostalCode5 = "13662"
                },
            };
            var saveResult = enrollmentService.BeginSaveEnrollment(globalCustomerId, userContext, null).Result;
            while (!saveResult.IsCompleted)
            {
                saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
            }

            var creditCheck = enrollmentService.BeginCreditCheck(globalCustomerId,
                name: TestData.CreditCheckContactInfo().Name,
                ssn: TestData.CreditCheckSsn,
                address: TestData.CreditCheckAddress()).Result;
            do
            {
                creditCheck = enrollmentService.EndCreditCheck(creditCheck).Result;
            } while (!creditCheck.IsCompleted);

            var firstCheck = enrollmentService.BeginIdentityCheck(globalCustomerId,
                name: TestData.IdentityCheckName(),
                ssn: TestData.IdentityCheckSsn,
                mailingAddress: TestData.IdentityCheckMailingAddress()).Result;

            var secondCheck = enrollmentService.BeginIdentityCheck(globalCustomerId,
                name: TestData.IdentityCheckName(),
                ssn: TestData.IdentityCheckSsn,
                mailingAddress: TestData.IdentityCheckMailingAddress(),
                identityInformation: new DomainModels.Enrollments.AdditionalIdentityInformation
                {
                    PreviousIdentityCheckId = firstCheck.Data.IdentityCheckId,
                    SelectedAnswers = firstCheck.Data.IdentityQuestions.ToDictionary(q => q.QuestionId, q => q.Answers[0].AnswerId)
                }).Result;

            do
            {
                secondCheck = enrollmentService.EndIdentityCheck(secondCheck).Result;
            } while (!secondCheck.IsCompleted);

            Mock<DomainModels.Enrollments.IOfferOptionRules> mockRules = new Mock<DomainModels.Enrollments.IOfferOptionRules>();
            mockRules.Setup(r => r.GetPostBilledPayments(It.IsAny<DomainModels.Enrollments.IOfferOption>())).Returns(new DomainModels.Enrollments.IOfferPaymentAmount[0]);
            var deposits = enrollmentService.LoadOfferPayments(globalCustomerId, saveResult.Data, userContext.Services, new DomainModels.Enrollments.InternalContext
            {
                GlobalCustomerId = globalCustomerId,
                EnrollmentSaveState = saveResult,
                IdentityCheck = secondCheck,
                OfferOptionRules = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>[] 
                { 
                    new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>
                    {
                        Location = location,
                        Offer = texasElectricityOffer,
                        Details = mockRules.Object
                    }
                }
            }).Result;

            using (new Timer())
            {
                // Act
                var result = enrollmentService.PlaceOrder(userContext.Services, new Dictionary<DomainModels.Enrollments.AdditionalAuthorization, bool>(), new DomainModels.Enrollments.InternalContext
                {
                    GlobalCustomerId = globalCustomerId,
                    EnrollmentSaveState = saveResult,
                    Deposit = deposits,
                }).Result;

                // Assert
                Assert.IsNotNull(result);
                Assert.IsTrue(result.Any());
                Assert.IsTrue(result.First().Details.IsSuccess);
                Assert.IsNotNull(result.First().Details.ConfirmationNumber);
            }
        }


        [TestMethod]
        [TestCategory("StreamConnect")]
        [TestCategory("StreamConnect Enrollments")]
        [TestCategory("StreamConnect Texas Enrollments")]
        public void PostDepositsTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result.GlobalCustomerId;
            var location = new DomainModels.Enrollments.Location
            {
                Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                Capabilities = new DomainModels.IServiceCapability[]
                {
                    new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                    new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                }
            };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricity.Offer;
            var userContext = new DomainModels.Enrollments.UserContext
            {
                ContactInfo = TestData.CreditCheckContactInfo(),
                SocialSecurityNumber = TestData.CreditCheckSsn,
                Services = new DomainModels.Enrollments.LocationServices[]
                {
                    new DomainModels.Enrollments.LocationServices 
                    { 
                        Location = location, 
                        SelectedOffers = new DomainModels.Enrollments.SelectedOffer[] 
                        {
                            new DomainModels.Enrollments.SelectedOffer
                            {
                                Offer = texasElectricityOffer,
                                OfferOption = new DomainModels.Enrollments.TexasElectricity.MoveInOfferOption 
                                { 
                                    ConnectDate = DateTime.Today.AddDays(3),
                                }
                            }
                        }
                    }
                },
                MailingAddress = new DomainModels.Address
                {
                    City = "MASSENA",
                    StateAbbreviation = "NY",
                    Line1 = "100 WILSON HILL RD",
                    PostalCode5 = "13662"
                },
            };
            Mock<DomainModels.Enrollments.IOfferOptionRules> mockRules = new Mock<DomainModels.Enrollments.IOfferOptionRules>();
            mockRules.Setup(r => r.GetPostBilledPayments(It.IsAny<DomainModels.Enrollments.IOfferOption>())).Returns(new DomainModels.Enrollments.IOfferPaymentAmount[0]);
            var internalContext = new DomainModels.Enrollments.InternalContext
            {
                OfferOptionRules = new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>[] 
                        { 
                            new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.IOfferOptionRules>
                            {
                                Location = location,
                                Offer = texasElectricityOffer,
                                Details = mockRules.Object
                            }
                        }
            };
            var saveResult = enrollmentService.BeginSaveEnrollment(gcid, userContext, null).Result;
            while (!saveResult.IsCompleted)
            {
                saveResult = enrollmentService.EndSaveEnrollment(saveResult, userContext).Result;
            }

            var creditCheck = enrollmentService.BeginCreditCheck(gcid,
                name: TestData.CreditCheckContactInfo().Name,
                ssn: TestData.CreditCheckSsn,
                address: TestData.CreditCheckAddress()).Result;
            do
            {
                creditCheck = enrollmentService.EndCreditCheck(creditCheck).Result;
            } while (!creditCheck.IsCompleted);
            var offerPayments = enrollmentService.LoadOfferPayments(gcid, saveResult.Data, userContext.Services, internalContext).Result;
            var offerPayment = offerPayments.Single();
            if (offerPayment.Details.RequiredAmounts.OfType<DomainModels.Enrollments.DepositOfferPaymentAmount>().First().DollarAmount == 0)
                Assert.Inconclusive("No deposit assessed.");

            using (new Timer())
            {
                // Act
                var result = enrollmentService.PayDeposit(offerPayments, saveResult.Data.Results, new DomainModels.Payments.TokenizedCard
                    {
                        CardToken = "9442268296134448",
                        BillingZipCode = "75201",
                        ExpirationDate = DateTime.Today.AddDays(60),
                        SecurityCode = "123"
                    }, userContext).Result;

                // Assert
                Assert.AreEqual(1, result.Count());
                Assert.IsNotNull(result.First().Details.ConfirmationNumber);
            }
        }

    }
}
