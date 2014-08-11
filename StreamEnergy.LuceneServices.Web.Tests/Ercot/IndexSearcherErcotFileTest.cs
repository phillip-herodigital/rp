using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.DomainModels;
using StreamEnergy.LuceneServices.IndexGeneration;
using StreamEnergy.LuceneServices.IndexGeneration.Ercot;
using StreamEnergy.LuceneServices.Web.Models;

namespace StreamEnergy.LuceneServices.Web.Tests.Ercot
{
    [TestClass]
    public class IndexSearcherErcotFileTest
    {
        private TestContext testContextInstance;
        private static IndexSearcher searcher;

        /// <summary>
        ///Gets or sets the test context which provides
        ///information about and functionality for the current test run.
        ///</summary>
        public TestContext TestContext
        {
            get
            {
                return testContextInstance;
            }
            set
            {
                testContextInstance = value;
            }
        }

        private static string BuildIndexPath(TestContext testContext)
        {
            var output = System.IO.Path.Combine(testContext.TestDir, testContext.FullyQualifiedTestClassName);
            return output;
        }


        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext)
        {
            var container = ContainerSetup.Create();

            using (var target = new FileReader())
            using (var stream = typeof(IndexSearcherErcotFileTest).Assembly.GetManifestResourceStream("StreamEnergy.LuceneServices.Web.Tests.Ercot.ext.00000203.0000000000000000.20140527.055928559.ONCOR_ELEC___DAILY.zip"))
            using (var builder = new IndexBuilder(BuildIndexPath(testContext), true))
            {
                var data = target.ReadZipFile(stream, "ONCOR");

                //builder.WriteIndex(data, "ONCOR").Wait();
            }

            searcher = new IndexSearcher(BuildIndexPath(testContext));
        }

        [ClassCleanup()]
        public static void MyClassCleanup() 
        {
            ((IDisposable)searcher).Dispose();
        }

        private static Dictionary<string, string> PerformSearch(string query)
        {
            return searcher.Search("TX", query).ToDictionary(loc => loc.Capabilities.OfType<TexasServiceCapability>().Single().EsiId, loc => loc.Address.ToSingleLine());
        }

        [TestMethod]
        public void PartialTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects

            // Act
            var results = PerformSearch("Illinois");

            // Assert
            Assert.IsTrue(results.ContainsKey("10443720001551003"));
            Assert.AreEqual(1, results.Count);
        }

        [TestMethod]
        public void ExactMatchTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = new Address { Line1 = "115 W ILLINOIS AVE", City = "DALLAS", StateAbbreviation = "TX", PostalCode5 = "75224", PostalCodePlus4 = "2216" }.ToSingleLine();

            // Act
            var results = PerformSearch(testString);

            // Assert
            Assert.IsTrue(results.ContainsKey("10443720001551003"));
            Assert.AreEqual(1, results.Count);
        }

        [TestMethod]
        public void CloseMatchTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = "115 ILLNOIS AVE DALLAS TX 75224";

            // Act
            var results = PerformSearch(testString);

            // Assert
            Assert.IsTrue(results.ContainsKey("10443720001551003"));
            // allow a fuzzy conditional here - not too many results, but there is only one 115 Illinois in our test data
            Assert.IsTrue(3 >= results.Count);
        }

        [TestMethod]
        public void ApartmentListPartialNameTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = "2311 W GRAPEVINE MILLS CIR";

            // Act
            var results = PerformSearch(testString);

            // Assert
            // allow a fuzzy conditional here - there are at least 10 2311 W Grapevine Mills Cir in our test data
            Assert.IsTrue(10 <= results.Count);
        }

        [TestMethod]
        public void ApartmentListTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = "2311 W";

            // Act
            var results = PerformSearch(testString);

            // Assert
            // allow a fuzzy conditional here - there are at least 10 2311 W Grapevine Mills Cir in our test data
            Assert.IsTrue(10 <= results.Count);
        }

        [TestMethod]
        public void ApartmentTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = "2311 GRAPEVINE MILLS 3202";

            // Act
            var results = PerformSearch(testString);

            // Assert
            Assert.IsTrue(results.ContainsKey("10443720009453090"));
            // allow a fuzzy conditional here - not too many results, but there is only one 2311 W GRAPEVINE MILLS CIR APT 3202 in our test data
            Assert.IsTrue(3 >= results.Count);
        }

        [TestMethod]
        public void CountyRoadTest()
        {
            // Arrange is done in the class initialization, thanks to stateless objects
            var testString = "1976 COUNTY 140";

            // Act
            var results = PerformSearch(testString);

            // Assert
            Assert.IsTrue(results.ContainsKey("10443720000311197"));
            // allow a fuzzy conditional here - not too many results, but there is only one 1976 COUNTY ROAD 140 in our test data
            Assert.IsTrue(3 >= results.Count);
        }
    }
}
