using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using StreamEnergy.Logging;

namespace StreamEnergy.MyStream.Tests.Services.Clients
{
    [TestClass]
    public class MobileEnrollmentServiceTest
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
        [TestCategory("StreamConnect Mobile Enrollments")]
        public void GetProductsGeorgiaZipTest()
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
                        Address = new DomainModels.Address { StateAbbreviation = "FL", PostalCode5 = "33418", },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.Mobile.ServiceCapability { ServiceProvider = DomainModels.Enrollments.Mobile.MobileServiceProvider.Sprint },
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

    }
}
