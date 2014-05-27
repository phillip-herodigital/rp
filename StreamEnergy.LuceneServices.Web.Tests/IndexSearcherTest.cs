using System;
using System.Linq;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.LuceneServices.IndexGeneration;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.LuceneServices.Web.Models;

namespace StreamEnergy.LuceneServices.Web.Tests
{
    /// <summary>
    /// Summary description for IndexBuilderTest
    /// </summary>
    [TestClass]
    public class IndexSearcherTest
    {
        private TestContext testContextInstance;
        private static readonly Location[] data = new[] {
                new Location
                {
                    Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                    Capabilities = new[] { new DomainModels.TexasServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" } }
                }
            };

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

        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext) 
        {
            var container = ContainerSetup.Create();

            var output = BuildIndexPath(testContext);
            var builder = new IndexBuilder(output);
            builder.WriteIndex(data);

        }
        //
        // Use ClassCleanup to run code after all tests in a class have run
        // [ClassCleanup()]
        // public static void MyClassCleanup() { }
        //
        // Use TestInitialize to run code before running each test 
        // [TestInitialize()]
        // public void MyTestInitialize() { }
        //
        // Use TestCleanup to run code after each test has run
        // [TestCleanup()]
        // public void MyTestCleanup() { }
        //
        #endregion

        [TestMethod]
        public void StreetNumber()
        {
            using (var searcher = new IndexSearcher(BuildIndexPath(TestContext)))
            {
                var results = searcher.Search("TX", "3620").ToArray();
                Assert.AreEqual(data.First().Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNameCorrect()
        {
            using (var searcher = new IndexSearcher(BuildIndexPath(TestContext)))
            {
                var results = searcher.Search("TX", "Huffines").ToArray();
                Assert.AreEqual(data.First().Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNumberAndName()
        {
            using (var searcher = new IndexSearcher(BuildIndexPath(TestContext)))
            {
                var results = searcher.Search("TX", "3620 Huffines").ToArray();
                Assert.AreEqual(data.First().Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNumberAndNameSpellingError()
        {
            using (var searcher = new IndexSearcher(BuildIndexPath(TestContext)))
            {
                var results = searcher.Search("TX", "3620 Hufines").ToArray();
                Assert.AreEqual(data.First().Address, results.First().Address);
            }
        }

        [TestMethod]
        public void EsiId()
        {
            using (var searcher = new IndexSearcher(BuildIndexPath(TestContext)))
            {
                var results = searcher.Search("TX", "1234SAMPLE5678").ToArray();
                Assert.AreEqual(data.First().Address, results.First().Address);
            }
        }
    }
}
