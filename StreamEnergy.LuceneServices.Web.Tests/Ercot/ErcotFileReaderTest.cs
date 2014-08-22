using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.LuceneServices.IndexGeneration.Ercot;

namespace StreamEnergy.LuceneServices.Web.Tests.Ercot
{
    [TestClass]
    public class ErcotFileReaderTest
    {
        [TestMethod]
        public void ReadErcotOncorDelta()
        {
            // Arrange
            using (var target = new FileReader())
            using (var stream = this.GetType().Assembly.GetManifestResourceStream("StreamEnergy.LuceneServices.Web.Tests.Ercot.ext.00000203.0000000000000000.20140527.055928559.ONCOR_ELEC___DAILY.zip"))
            {
                // Act
                var results = target.ReadZipFile(stream, "ONCOR");
                var lookup = results.ToDictionary(loc => loc.Item2.OfType<TexasServiceCapability>().Single().EsiId, loc => StreamEnergy.LuceneServices.IndexGeneration.ErcotAddressReader.FromRecord(loc.Item1));

                // Assert
                Assert.AreEqual(new Address { Line1 = "115 W ILLINOIS AVE", City = "DALLAS", StateAbbreviation = "TX", PostalCode5 = "75224", PostalCodePlus4 = "2216" }.ToSingleLine(), lookup["10443720001551003"].ToSingleLine());
                Assert.AreEqual(new Address { Line1 = "2311 W GRAPEVINE MILLS CIR", UnitNumber = "APT 3202", City = "GRAPEVINE", StateAbbreviation = "TX", PostalCode5 = "76051" }.ToSingleLine(), lookup["10443720009453090"].ToSingleLine());
                Assert.AreEqual(new Address { Line1 = "712 RIDGEDALE DR", City = "RICHARDSON", StateAbbreviation = "TX", PostalCode5 = "75080", PostalCodePlus4 = "5513" }.ToSingleLine(), lookup["10443720005165470"].ToSingleLine());
                Assert.AreEqual(new Address { Line1 = "300 OHIO AVE N", City = "GRAHAM", StateAbbreviation = "TX", PostalCode5 = "76450", PostalCodePlus4 = "1810" }.ToSingleLine(), lookup["10443720007113675"].ToSingleLine()); 
            }
        }
    }
}
