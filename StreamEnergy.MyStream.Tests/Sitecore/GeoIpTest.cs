using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace StreamEnergy.MyStream.Tests.Sitecore
{
    [TestClass]
    public class GeoIpTest
    {

        [ClassInitialize]
        public static void InitializeDummySetting(TestContext testContext)
        {
            var container = ContainerSetup.Create();
        }

        [ClassCleanup]
        public static void CleanupDummySetting()
        {
        }

        [TestMethod]
        public void LookupManagerTest()
        {
            var whois = global::Sitecore.Analytics.Lookups.LookupManager.GetInformationByIp("74.83.221.108");

            Assert.AreEqual("Mason", whois.City);
            Assert.AreEqual("US", whois.Country);
        }

        [TestMethod]
        public void GeoIpManagerTest()
        {
            var whois = global::Sitecore.Analytics.Lookups.GeoIpManager.GetGeoIpData(new global::Sitecore.Analytics.Lookups.GeoIpOptions
                {
                    Ip = System.Net.IPAddress.Parse("74.83.221.108"),
                    MillisecondsTimeout = 1000
                });

            Assert.AreEqual("Cincinnati", whois.GeoIpData.City);
            Assert.AreEqual("US", whois.GeoIpData.Country);
        }
    }
}
