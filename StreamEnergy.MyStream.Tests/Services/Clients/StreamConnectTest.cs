﻿using System;
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
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=New&Address.Zip=75010").Result;
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
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=New&Address.Zip=75010&SystemOfRecord=CIS1").Result;
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
            var response = streamConnectClient.GetAsync("/api/products?CustomerType=Residential&EnrollmentType=New&UtilityAccountNumber=10443720006102389&SystemOfRecord=CIS1&Address.City=Carrollton&Address.State=TX&Address.StreetLine1=3620%20Huffines%20Blvd&Address.StreetLine2=APT%20226&Address.Zip=75010").Result;
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
            var data = JsonConvert.DeserializeObject(responseString);

            // Assert
            Assert.IsTrue(response.IsSuccessStatusCode);
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
            Assert.IsNotNull((string)result["IdVerificationChallenge"]["CreditServiceSessionId"].Value);            
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
            Assert.IsNotNull((string)result["PartitionKey"].Value);
            Assert.AreNotEqual(Guid.Empty, Guid.Parse((string)result["MessageId"].Value));
        }
    }
}
