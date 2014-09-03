using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    [TestClass]
    public class StreamConnectTest
    {
        private static IUnityContainer container;

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
            container = new UnityContainer();

            new StreamEnergy.CoreContainerSetup().SetupUnity(container);
            new StreamEnergy.Caching.RedisCacheContainerSetup().SetupUnity(container);
            new StreamEnergy.Services.Clients.ClientContainerSetup().SetupUnity(container);
            new StreamEnergy.Services.Clients.StreamConnectContainerSetup().SetupUnity(container);
        }

        [TestMethod]
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
                            new DomainModels.Enrollments.TexasServiceCapability { Tdu = "ONCOR" },
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
                            new DomainModels.Enrollments.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
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
        public void GetMoveInDatesTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            // Act
            DomainModels.Enrollments.IConnectDatePolicy connectDates;
            using (new Timer())
            {
                connectDates = enrollmentService.LoadConnectDates(new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.Enrollments.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                        new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                    }
                }).Result;
            }

            // Assert
            Assert.IsTrue(connectDates.AvailableConnectDates.Any());
        }

        [TestMethod]
        public void PostCustomersEmptyTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer().Result;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        public void PostCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        public void GetCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

            // Act
            string email;
            using (new Timer())
            {
                email = accountService.GetEmailByCustomerId(gcid).Result;
            }
            
            // Assert
            Assert.AreEqual("test@example.com", email);
        }

        [TestMethod]
        public void PostCustomersPortalIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            Guid globalCustomerId;
            using (new Timer())
            {
                globalCustomerId = accountService.CreateStreamConnectCustomer(username: "extranet//tester").Result;
            }

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        public void GetCustomersPortalIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            var gcid = accountService.CreateStreamConnectCustomer(username: "extranet//tester").Result;

            // Act
            HttpResponseMessage response;
            dynamic result;
            using (new Timer())
            {
                response = streamConnectClient.GetAsync("/api/customers/" + gcid.ToString()).Result;
                var responseString = response.Content.ReadAsStringAsync().Result;
                result = JsonConvert.DeserializeObject(responseString);
            }

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreEqual(gcid, Guid.Parse((string)(result["Customer"]["GlobalCustomerId"].Value)));
            Assert.AreEqual("extranet//tester", result["Customer"]["PortalId"].Value);

        }

        [TestMethod]
        public void PostVerificationsIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

            using (new Timer())
            {
                // Act
                var firstCheck = enrollmentService.BeginIdentityCheck(gcid,
                    name: new DomainModels.Name { First = "ROBERT", Last = "DELEON" },
                    ssn: "666540716",
                    mailingAddress: new DomainModels.Address { Line1 = "100 WILSON HILL RD", City = "MASSENA", StateAbbreviation = "NY", PostalCode5 = "13662" }).Result;

                // Assert
                Assert.IsNotNull(firstCheck);
                Assert.IsTrue(firstCheck.IsCompleted);
                Assert.IsNotNull(firstCheck.Data.IdentityCheckId);

                // Since we're really verifying the API, not actually testing our code, there's no reason to follow the AAA test standard.
                // Don't take this as an example of OK - this should be multiple tests, with either initial setup or in the "assign" section.

                // Act - Step 2
                var secondCheck = enrollmentService.BeginIdentityCheck(gcid,
                    name: new DomainModels.Name { First = "ROBERT", Last = "DELEON" },
                    ssn: "666540716",
                    mailingAddress: new DomainModels.Address { Line1 = "100 WILSON HILL RD", City = "MASSENA", StateAbbreviation = "NY", PostalCode5 = "13662" },
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
        public void PostVerificationsCreditTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

            using (new Timer())
            {
                // Act - Step 2
                var creditCheck = enrollmentService.BeginCreditCheck(gcid,
                    name: new DomainModels.Name { First = "Mauricio", Last = "Solórzano" },
                    ssn: "123456789",
                    address: new DomainModels.Address { Line1 = "1212 Aberdeen Avenue", City = "McKinney", StateAbbreviation = "TX", PostalCode5 = "75070" }).Result;

                // Assert
                Assert.IsNotNull(creditCheck);
                Assert.IsFalse(creditCheck.IsCompleted);

                // Act - Step 3 - async response
                do
                {
                    creditCheck = enrollmentService.EndCreditCheck(creditCheck).Result;
                } while (!creditCheck.IsCompleted);

                // Assert
                Assert.IsTrue(creditCheck.IsCompleted);
            }
        }

        [TestMethod]
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
                            new DomainModels.Enrollments.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                    }).Result;

                // Assert
                Assert.AreEqual(DomainModels.Enrollments.PremiseVerificationResult.Success, result);
            }
        }

        [TestMethod]
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
                                        new DomainModels.Enrollments.TexasServiceCapability 
                                        { 
                                            Address = "03620     HUFFINES                    BLVD",
                                            AddressOverflow = "",
                                            City = "CARROLLTON",
                                            EsiId = "10443720006156949",
                                            MeterType = DomainModels.Enrollments.TexasMeterType.Amsm,
                                            State = "TX",
                                            Tdu = "ONCOR ELEC",
                                            Zipcode = "750106446"
                                        }
                                    }
                                }, 
                            }
                        }
                    }).Result;

                // Assert
                Assert.IsTrue(result);
            }
        }

        [TestMethod]
        public void PostEnrollmentsCreate()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;
            var location = new DomainModels.Enrollments.Location
                    {
                        Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                    };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricityOffer;
            var userContext = new DomainModels.Enrollments.UserContext
                {
                    ContactInfo = new DomainModels.CustomerContact
                    {
                        Name = new DomainModels.Name
                        {
                            First = "ROBERT",
                            Last = "DELEON"
                        },
                        Phone = new DomainModels.Phone[] { new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = "2234567890" } },
                        Email = new DomainModels.Email { Address = "test@example.com" },
                    },
                    SocialSecurityNumber = "529998765",
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
                                    OfferOption = new DomainModels.Enrollments.TexasElectricityMoveInOfferOption 
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
                var saveResult = enrollmentService.BeginSaveEnrollment(globalCustomerId, userContext).Result;

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

                }
                else
                {
                    Assert.Fail("No data from Stream Connect");
                }
            }
        }
    }
}
