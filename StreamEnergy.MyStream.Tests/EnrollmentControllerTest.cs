using Microsoft.Practices.Unity;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Moq;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.MyStream.Controllers;
using System;
using System.Linq;
using System.Web;
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
        public void NewClientDataTest()
        {
            var controller = container.Resolve<EnrollmentController>();
            var clientData = controller.ClientData();

            Assert.IsNotNull(clientData);
            Assert.IsNull(clientData.UserContext.SocialSecurityNumber);
        }

        [TestMethod]
        public void SaveOnDisposeTest()
        {
            using (container.Resolve<EnrollmentController>())
            {
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.Any(key => session[key] is UserContext));
            Assert.IsTrue(keys.Any(key => session[key] is InternalContext));
            Assert.IsTrue(keys.Any(key => (session[key] as Type) == typeof(DomainModels.Enrollments.ServiceInformationState)));

            var sessionHelper = container.Resolve<EnrollmentController.SessionHelper>();

            Assert.IsTrue(sessionHelper.UserContext is UserContext);
            Assert.IsTrue(sessionHelper.InternalContext is InternalContext);
            Assert.IsTrue(sessionHelper.State == typeof(DomainModels.Enrollments.ServiceInformationState));
        }

        [TestMethod]
        public void NoSaveOnDisposeTest()
        {
            using (var controller = container.Resolve<EnrollmentController>())
            {
                controller.Reset();
            }
            var session = container.Resolve<HttpSessionStateBase>();

            var keys = session.Keys.Cast<string>();
            Assert.IsTrue(keys.All(key => session[key] == null));
        }

        [TestMethod]
        public void PostServiceInformationTest()
        {
            // TODO - remove this mock and replace with a service-level mock
            Mock<IEnrollmentService> service = new Mock<IEnrollmentService>();
            container.Unity.RegisterInstance(service.Object);

            using (var controller = container.Resolve<EnrollmentController>())
            {
                var request = new Models.Enrollment.ServiceInformation
                {
                    IsNewService = true,
                    ServiceAddress = new DomainModels.Address { PostalCode5 = "75010" },
                    ServiceCapabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint" } }
                };
                service.Setup(svc => svc.LoadOffers(request.ServiceAddress, request.ServiceCapabilities, request.IsNewService)).Returns(Enumerable.Empty<IOffer>());

                var result = controller.ServiceInformation(request);
                Assert.IsTrue(result.UserContext.IsNewService);
                Assert.AreEqual("SelectedOffers", result.Validations.Single().MemberName);
                Assert.AreEqual("75010", result.UserContext.ServiceAddress.PostalCode5);
                Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, result.UserContext.ServiceCapabilities.First().CapabilityType);
                Assert.AreEqual("Centerpoint", (result.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).Tdu);
            }
            var session = container.Resolve<EnrollmentController.SessionHelper>();

            Assert.IsTrue(session.UserContext.IsNewService);
            Assert.AreEqual("75010", session.UserContext.ServiceAddress.PostalCode5);
            Assert.AreEqual(DomainModels.TexasServiceCapability.capabilityType, session.UserContext.ServiceCapabilities.First().CapabilityType);
            Assert.AreEqual("Centerpoint", (session.UserContext.ServiceCapabilities.First() as DomainModels.TexasServiceCapability).Tdu);
        }
    }
}
