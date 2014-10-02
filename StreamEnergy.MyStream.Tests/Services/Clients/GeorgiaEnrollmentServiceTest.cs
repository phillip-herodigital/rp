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
    public class GeorgiaEnrollmentServiceTest
    {
        private static Unity.Container container;

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
        [TestCategory("StreamConnect Georgia Enrollments")]
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
                        Address = new DomainModels.Address { StateAbbreviation = "GA", PostalCode5 = "30080", },
                        Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.GeorgiaGasServiceCapability { Zipcode = "30080" },
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
        [TestCategory("StreamConnect Georgia Enrollments")]
        public void PostVerifyPremiseGeorgiaTest()
        {
            // Assign
            StreamEnergy.DomainModels.Enrollments.IEnrollmentService enrollmentService = container.Resolve<StreamEnergy.Services.Clients.EnrollmentService>();

            using (new Timer())
            {
                // Act
                var result = enrollmentService.VerifyPremise(new DomainModels.Enrollments.Location
                {
                    Address = new DomainModels.Address { Line1 = "3 The Croft", UnitNumber = "3 Lot", City = "Atlanta", StateAbbreviation = "GA", PostalCode5 = "30342", PostalCodePlus4 = "2438" },
                    Capabilities = new DomainModels.IServiceCapability[]
                        {
                            new DomainModels.Enrollments.GeorgiaGasServiceCapability { AglAccountNumber = "0715818330", Zipcode = "30342" },
                            new DomainModels.Enrollments.ServiceStatusCapability { EnrollmentType = DomainModels.Enrollments.EnrollmentType.MoveIn },
                            new DomainModels.Enrollments.CustomerTypeCapability { CustomerType = DomainModels.Enrollments.EnrollmentCustomerType.Residential },
                        }
                }).Result;

                // Assert
                Assert.AreEqual(DomainModels.Enrollments.PremiseVerificationResult.Success, result);
            }
        }

    }
}
