using System;
using System.Collections.Generic;
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
            var result = enrollmentService.LoadOffers(new[] 
            { 
                new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.TexasServiceCapability { Tdu = "ONCOR" },
                        new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    }
                }
            }).Result;
            
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
            var result = enrollmentService.LoadOffers(new[] 
            { 
                new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                        new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    }
                }
            }).Result;

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
            var connectDates = enrollmentService.LoadConnectDates(new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                        new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    }
                }).Result;

            // Assert
            Assert.IsTrue(connectDates.AvailableConnectDates.Any());
        }

        [TestMethod]
        public void PostCustomersEmptyTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            var globalCustomerId = accountService.CreateStreamConnectCustomer().Result;

            // Assert
            Assert.AreNotEqual(Guid.Empty, globalCustomerId);
        }

        [TestMethod]
        public void PostCustomersEmailTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            var globalCustomerId = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

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
            var email = accountService.GetEmailByCustomerId(gcid).Result;
            
            // Assert
            Assert.AreEqual("test@example.com", email);
        }

        [TestMethod]
        public void PostCustomersPortalIdTest()
        {
            // Assign
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();

            // Act
            var globalCustomerId = accountService.CreateStreamConnectCustomer(username: "extranet//tester").Result;

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

        [TestMethod]
        public void PostVerificationsCreditTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            StreamEnergy.DomainModels.Accounts.IAccountService accountService = container.Resolve<StreamEnergy.Services.Clients.AccountService>();
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();
            var gcid = accountService.CreateStreamConnectCustomer(email: "test@example.com").Result;

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

        [TestMethod]
        public void PostVerifyPremiseTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            // Act
            var result = enrollmentService.VerifyPremise(new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { StateAbbreviation = "TX", PostalCode5 = "75010", City = "Carrollton", Line1 = "3620 Huffines Blvd", Line2 = "APT 226" },
                    Capabilities = new DomainModels.IServiceCapability[]
                    {
                        new DomainModels.TexasServiceCapability { Tdu = "ONCOR", EsiId = "10443720006102389" },
                        new DomainModels.Enrollments.ServiceStatusCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential, EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                    }
                }).Result;
            
            // Assert
            Assert.AreEqual(true, result);
        }

        [TestMethod]
        public void PostEnrollmentsCommercial()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

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

        [TestMethod]
        public void PostEnrollmentsCreate()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            Guid globalCustomerId;
            {
                var createCustomerResponse = streamConnectClient.PostAsJsonAsync("/api/customers", new { EmailAddress = "test@example.com" }).Result;
                Assert.IsTrue(createCustomerResponse.IsSuccessStatusCode);
                globalCustomerId = Guid.Parse((string)(((dynamic)JsonConvert.DeserializeObject(createCustomerResponse.Content.ReadAsStringAsync().Result))["Customer"]["GlobalCustomerId"].Value));
            }

            // Act
            var response = streamConnectClient.PostAsJsonAsync("/api/customers/" + globalCustomerId.ToString() + "/enrollments", new[]
            {
                new 
                {
                    GlobalCustomerId= globalCustomerId.ToString(),
                    CustomerType= "Residential",
                    SystemOfRecord= "CIS1",
                    FirstName= "sample string 5",
                    LastName= "sample string 6",
                    BillingAddress= new {
                      StreetLine1= "sample string 1",
                      StreetLine2= "sample string 2",
                      City= "sample string 3",
                      State= "sample string 4",
                      Zip= "sample string 5"
                    },
                    PhoneNumbers= new[] {
                      new {
                        Number= "sample string 1",
                        Type= "Home"
                      },
                      new {
                        Number= "sample string 1",
                        Type= "Home"
                      }
                    },
                    SSN= "sample string 7",
                    EmailAddress= "sample string 10",
                    Premise= new {
                      EnrollmentType= "MoveIn",
                      SelectedMoveInDate= "2014-08-19T15:29:36.0899745Z",
                      UtilityProvider= new {
                        Id= "sample string 1",
                        Code= "sample string 2",
                        Name= "sample string 3",
                        Commodities= new[] { "Electricity" }
                      },
                      UtilityAccountNumber= "sample string 2",
                      Product= new {
                        ProductCode= "sample string 1",
                        Name= "sample string 2",
                        Description= "sample string 3",
                        Rate= new {
                          Value= 1.0,
                          Type= "Fixed",
                          Unit= "sample string 2"
                        },
                        Term= 4
                      },
                      ServiceAddress= new {
                        StreetLine1= "sample string 1",
                        StreetLine2= "sample string 2",
                        City= "sample string 3",
                        State= "sample string 4",
                        Zip= "sample string 5"
                      },
                      ProductType= "Gas",
                      Deposit= new {
                        CreateDate= "2014-08-19T15:29:36.1047927Z",
                        Amount= 2.0,
                        IsWaived= true
                      }
                    }
                }
            }).Result;

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            var asyncUrl = response.Headers.Location;
            Assert.IsNotNull(response.Headers.Location);

            // Act - Step 3 - async response
            dynamic result;
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
            if (result.EnrollmentResponses.Count > 0)
            {

            }
            else
            {
                Assert.Inconclusive("No data from Stream Connect");
            }
        }
    }
}
