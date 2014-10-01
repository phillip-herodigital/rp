using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.Services.Clients;

namespace StreamEnergy.MyStream.Tests.Services
{
    [TestClass]
    public class PdfGeneration
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
        public async Task GetPdfTest()
        {
            var pdfGenerationService = container.Resolve<IPdfGenerationService>();
            var response = pdfGenerationService.GenerateW9("Full Name", "Business Name", PdfBusinessTypes.SCorporation, "Other Type", false, "Address Line #1, Address Line #2", "City", "ST", "12345", "123456789", "987654321", null, DateTime.Now);

            Assert.IsNotNull(response);
        }
    }
}
