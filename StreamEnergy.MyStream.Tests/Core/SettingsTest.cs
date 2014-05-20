using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace StreamEnergy.MyStream.Tests.Core
{
    [TestClass]
    public class SettingsTest
    {
        private Unity.Container container;

        [TestInitialize]
        public void InitializeTest()
        {
            container = ContainerSetup.Create();
        }

        [TestMethod]
        public void EnvironmentTest()
        {
            // our configs come from the developer's default check-out copy - they should always be development environments
            Assert.AreEqual(EnvironmentCategory.Development, container.Resolve<EnvironmentCategory>());
        }

        [TestMethod]
        public void GetSettingsItemTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var marketingFormEmailAddresses = settingResolver.GetSettingsItem("Marketing Form Email Addresses");

            Assert.IsNotNull(marketingFormEmailAddresses);
        }

        [TestMethod]
        public void GetSettingsValueTest()
        {
            var settingResolver = container.Resolve<ISettings>();
            var marketingFormEmailAddresses = settingResolver.GetSettingsValue("Marketing Form Email Addresses", "Commercial Quote Email Address");

            Assert.IsNotNull(marketingFormEmailAddresses);
        }
    }
}
