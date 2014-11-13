using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Services.Clients;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.MobileEnrollment;

namespace StreamEnergy.MyStream.Tests.Services
{
    [TestClass]
    public class W9Generation
    {
        private static Unity.Container container;
        [ClassInitialize]
        public static void ClassInitialize(TestContext context)
        {
            container = ContainerSetup.Create(c =>
            {
                
            });
        }
        [TestMethod]
        public void GetW9Test()
        {
            var pdfGenerationService = container.Resolve<IW9GenerationService>();
            var response = pdfGenerationService.GenerateW9("Full Name", "Business Name", W9BusinessClassification.SCorporation, "Other Type", null, null, new Address { Line1 = "Address Line #1", Line2 = "Address Line #2", City = "City", StateAbbreviation = "ST", PostalCode5 = "12345" }, null, "123456789", "987654321", "R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==", DateTime.Now);

            Assert.IsNotNull(response);
        }
    }
}
