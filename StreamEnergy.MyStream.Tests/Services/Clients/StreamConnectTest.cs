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
                            new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
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
                            new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
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
                        new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
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
                // Act
                HttpResponseMessage response;
                dynamic result;
                {
                    response = streamConnectClient.PostAsJsonAsync("/api/verifications/credit/" + gcid.ToString(), new
                    {
                        FirstName = "Mauricio",
                        LastName = "Solórzano",
                        SSN = "123456789",
                        Address = new
                        {
                            StreetLine1 = "1212 Aberdeen Avenue",
                            StreetLine2 = "Ste. 321",
                            City = "McKinney",
                            State = "TX",
                            Zip = "75070"
                        }
                    }).Result;
                    var responseString = response.Content.ReadAsStringAsync().Result;
                    result = JsonConvert.DeserializeObject(responseString);
                }

                // Assert
                Assert.IsTrue(response.IsSuccessStatusCode);
                var asyncUrl = response.Headers.Location;
                Assert.IsNotNull(response.Headers.Location);

                // Since we're really verifying the API, not actually testing our code, there's no reason to follow the AAA test standard.
                // Don't take this as an example of OK - this should be multiple tests, with either initial setup or in the "assign" section.

                // Act - Step 2 - async response
                do
                {
                    {
                        response = streamConnectClient.GetAsync(asyncUrl).Result;
                        var responseString = response.Content.ReadAsStringAsync().Result;
                        result = JsonConvert.DeserializeObject(responseString);
                    }
                    Assert.IsTrue(response.IsSuccessStatusCode);
                } while (response.StatusCode == System.Net.HttpStatusCode.NoContent);

                // Assert
                Assert.IsTrue(response.IsSuccessStatusCode);
                Assert.IsTrue(result["Status"].Value == "Success" || result["Status"].Value == "Error");
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
                            new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                        }
                    }).Result;

                // Assert
                Assert.AreEqual(true, result);
            }
        }

        [TestMethod]
        public void PostEnrollmentsCommercial()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            using (new Timer())
            {
                // Act
                var response = streamConnectClient.PostAsJsonAsync("/api/Enrollments/commercial", new
                {
                    CompanyName = "sample string 1",
                    ContactFirstName = "sample string 2",
                    ContactMiddleName = "sample string 3",
                    ContactLastName = "sample string 4",
                    ContactTitle = "sample string 5",
                    ContactAddress = new
                    {
                        StreetLine1 = "sample string 1",
                        StreetLine2 = "sample string 2",
                        City = "sample string 3",
                        State = "AL",
                        Zip = "sample string 5"
                    },
                    ContactPhone = "sample string 6",
                    ContactHomePhone = "sample string 7",
                    ContactFax = "sample string 8",
                    ContactCellPhone = "sample string 9",
                    ContactEmail = "sample string 10",
                    SSN = "sample string 11",
                    BillingAddress = new
                    {
                        StreetLine1 = "sample string 1",
                        StreetLine2 = "sample string 2",
                        City = "sample string 3",
                        State = "AR",
                        Zip = "sample string 5"
                    },
                    AgentFirstName = "sample string 12",
                    AgentLastName = "sample string 13",
                    AgentID = "sample string 14",
                    PreferredLanguage = "English",
                    PreferredSalesExecutive = "sample string 15",
                    UnderContract = true,
                    SwitchType = "MoveIn",
                    FederalTaxId = "sample string 17",
                    BillingCompanyName = "sample string 18",
                    BillingFirstName = "sample string 19",
                    BillingLastName = "sample string 20",
                    BillingTitle = "sample string 21",
                    BillingPhone = "sample string 22",
                    BillingFax = "sample string 23",
                    BillingCellPhone = "sample string 24",
                    BillingEmail = "sample string 25",
                    DBA = "sample string 26",
                    Premises = new[] 
                    { 
                        new
                        {
                            Provider = new
                            {
                                Id = "",
                                Code = "",
                                Name = "",
                                Commodities = new[] { "Electricity" },
                            },
                            Commodity = "Electricity",
                            UtilityAccountNumber = "",
                            ServiceAddress = new
                            {
                                StreetLine1 = "sample string 1",
                                StreetLine2 = "sample string 2",
                                City = "sample string 3",
                                State = "TX",
                                Zip = "sample string 5"
                            },
                            Title = "",
                            FirstName = "",
                            MiddleName = "",
                            LastName = "",
                            Email = "",
                            PrimaryPhone = "",
                            FaxNumber = "",
                            BillingAddress = new
                            {
                                StreetLine1 = "sample string 1",
                                StreetLine2 = "sample string 2",
                                City = "sample string 3",
                                State = "AK",
                                Zip = "sample string 5"
                            },
                        }
                    }
                }).Result;

                // Assert
                Assert.IsTrue(response.IsSuccessStatusCode);
                var responseString = response.Content.ReadAsStringAsync().Result;
                dynamic result = JsonConvert.DeserializeObject(responseString);
                Assert.AreEqual("Success", result.Status.Value);
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
                            new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                        }
                    };
            var offers = enrollmentService.LoadOffers(new[] { location }).Result;
            var texasElectricityOffer = offers.First().Value.Offers.First() as DomainModels.Enrollments.TexasElectricityOffer;

            using (new Timer())
            {
                // Act
                var saveResult = enrollmentService.BeginSaveEnrollment(globalCustomerId, new DomainModels.Enrollments.UserContext
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
                                        BillingAddress = new DomainModels.Address
                                        {
                                            City = "MASSENA",
                                            StateAbbreviation = "NY",
                                            Line1 = "100 WILSON HILL RD",
                                            PostalCode5 = "13662"
                                        },
                                        ConnectDate = DateTime.Today.AddDays(3),
                                    }
                                }
                            }
                        }
                    }
                }).Result;

                // Assert
                Assert.IsFalse(saveResult.IsCompleted);
                Assert.IsNotNull(saveResult.ResponseLocation);

                // Act - Step 3 - async response
                while (!saveResult.IsCompleted)
                {
                    saveResult = enrollmentService.EndSaveEnrollment(saveResult).Result;
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
