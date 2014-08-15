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
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=MoveIn&ServiceAddress.State=TX&ServiceAddress.Zip=75010").Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            var data = (JArray)JsonConvert.DeserializeObject(responseString);

            // Assert
            if (data.Count > 0)
            {

            }
            else
            {
                Assert.Inconclusive("No data from Stream Connect");
            }
        }

        [TestMethod]
        public void GetProductsZipCsi1Test()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=MoveIn&ServiceAddress.State=TX&ServiceAddress.Zip=75010&SystemOfRecord=CIS1").Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            var data = (JArray)JsonConvert.DeserializeObject(responseString);

            // Assert
            if (data.Count > 0)
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
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=MoveIn&UtilityAccountNumber=10443720006102389&SystemOfRecord=CIS1&ServiceAddress.City=Carrollton&ServiceAddress.State=TX&ServiceAddress.StreetLine1=3620%20Huffines%20Blvd&ServiceAddress.StreetLine2=APT%20226&ServiceAddress.Zip=75010").Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            var data = (JArray)JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            if (data.Count > 0)
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
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.GetAsync("/api/MoveInDates?UtilityAccountNumber=10443720006102389&SystemOfRecord=CIS1&Address.City=Carrollton&Address.State=TX&Address.StreetLine1=3620%20Huffines%20Blvd&Address.StreetLine2=APT%20226&Address.Zip=75010").Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            var data = JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
        }

        [TestMethod]
        public void PostCustomersEmptyTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.PostAsJsonAsync("/api/customers", new { }).Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            dynamic data = JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreNotEqual(Guid.Empty, Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value)));
        }

        [TestMethod]
        public void PostCustomersEmailTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.PostAsJsonAsync("/api/customers", new { EmailAddress = "test@example.com" }).Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            dynamic data = JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreNotEqual(Guid.Empty, Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value)));
        }

        [TestMethod]
        public void GetCustomersEmailTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            Guid gcid;
            {
                var responseString = streamConnectClient.PostAsJsonAsync("/api/customers", new { EmailAddress = "test@example.com" }).Result.Content.ReadAsStringAsync().Result;
                dynamic data = JsonConvert.DeserializeObject(responseString);
                gcid = Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value));
            }

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
            Assert.AreEqual("test@example.com", result["Customer"]["EmailAddress"].Value);

        }

        [TestMethod]
        public void PostCustomersPortalIdTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.PostAsJsonAsync("/api/customers", new { PortalId = "extranet//tester" }).Result;
            var responseString = response.Content.ReadAsStringAsync().Result;
            dynamic data = JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            Assert.AreNotEqual(Guid.Empty, Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value)));
        }

        [TestMethod]
        public void GetCustomersPortalIdTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            Guid gcid;
            {
                var responseString = streamConnectClient.PostAsJsonAsync("/api/customers", new { PortalId = "extranet//tester" }).Result.Content.ReadAsStringAsync().Result;
                dynamic data = JsonConvert.DeserializeObject(responseString);
                gcid = Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value));
            }

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
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            Guid gcid;
            {
                var responseString = streamConnectClient.PostAsJsonAsync("/api/customers", new { EmailAddress = "test@example.com" }).Result.Content.ReadAsStringAsync().Result;
                dynamic data = JsonConvert.DeserializeObject(responseString);
                gcid = Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value));
            }

            // Act
            HttpResponseMessage response;
            dynamic result;
            {
                response = streamConnectClient.PostAsJsonAsync("/api/verifications/id/" + gcid.ToString(), new
                {
                    FirstName = "ROBERT",
                    LastName = "DELEON",
                    SSN = "666540716",
                    Address = new
                    {
                        StreetLine1 = "100 WILSON HILL RD",
                        City = "MASSENA",
                        State = "NY",
                        Zip = "13662"
                    }
                }).Result;
                var responseString = response.Content.ReadAsStringAsync().Result;
                result = JsonConvert.DeserializeObject(responseString);
            }

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            var creditServiceSessionId = (string)result["IdVerificationChallenge"]["CreditServiceSessionId"].Value;
            Assert.IsNotNull(creditServiceSessionId);

            // Since we're really verifying the API, not actually testing our code, there's no reason to follow the AAA test standard.
            // Don't take this as an example of OK - this should be multiple tests, with either initial setup or in the "assign" section.

            // Act - Step 2
            {
                response = streamConnectClient.PutAsJsonAsync("/api/verifications/id/" + gcid.ToString(), new
                {
                    CreditServiceSessionId = creditServiceSessionId,
                    Questions = (from dynamic question in (JArray)result["IdVerificationChallenge"]["Questions"]
                                 select new
                                 {
                                     Index = question["Index"],
                                     SelectedAnswerIndex = "1"
                                 }).ToArray()
                }).Result;
                var responseString = response.Content.ReadAsStringAsync().Result;
                result = JsonConvert.DeserializeObject(responseString);
            }

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            var asyncUrl = response.Headers.Location;
            Assert.IsNotNull(response.Headers.Location);

            // Act - Step 3 - async response
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
        public void PostVerificationsCreditTest()
        {
            // Assign
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);
            Guid gcid;
            {
                var responseString = streamConnectClient.PostAsJsonAsync("/api/customers", new { EmailAddress = "test@example.com" }).Result.Content.ReadAsStringAsync().Result;
                dynamic data = JsonConvert.DeserializeObject(responseString);
                gcid = Guid.Parse((string)(data["Customer"]["GlobalCustomerId"].Value));
            }

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
            var streamConnectClient = container.Resolve<HttpClient>(StreamEnergy.Services.Clients.StreamConnectContainerSetup.StreamConnectKey);

            // Act
            var response = streamConnectClient.PostAsJsonAsync("/api/Enrollments/VerifyPremise", new 
            {
                ServiceAddress = new
                {
                    City = "Carrollton",
                    State = "TX",
                    StreetLine1 = "3620 Huffines Blvd",
                    StreetLine2 = "APT 226",
                    Zip = "75010"
                },
                UtilityAccountNumber = "10443720006102389",
                EnrollmentType = "MoveIn"
            }).Result;
            
            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
            var responseString = response.Content.ReadAsStringAsync().Result;
            dynamic result = JsonConvert.DeserializeObject(responseString);
            Assert.AreEqual(true, result.IsEligibleField.Value);
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
    }
}
