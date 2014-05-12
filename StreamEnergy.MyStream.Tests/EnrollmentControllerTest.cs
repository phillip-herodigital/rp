using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.MyStream.Controllers;
using System.Web.Http.Controllers;

namespace StreamEnergy.MyStream.Tests
{
    [TestClass]
    public class EnrollmentControllerTest
    {
        private Unity.Container container;

        [TestInitialize]
        public void InitializeTest()
        {
            container = ContainerSetup.Create();
        }

        [TestMethod]
        public void ClientDataTest()
        {
            var controller = container.Resolve<EnrollmentController>();
            var clientData = controller.ClientData();

            Assert.IsNotNull(clientData);
            Assert.IsNull(clientData.UserContext.SocialSecurityNumber);
        }
    }
}
