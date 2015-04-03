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
        private static readonly Tuple<Location, EnrollmentCustomerType>[] data = new[] {
                Tuple.Create(
                    new Location
                    {
                        Address = new DomainModels.Address { Line1 = "3620 Huffines Blvd", UnitNumber = "226", City = "Carrollton", StateAbbreviation = "TX", PostalCode5 = "75010" },
                        Capabilities = new[] { new DomainModels.Enrollments.TexasElectricity.ServiceCapability { Tdu = "Centerpoint", EsiId = "1234SAMPLE5678" } }
                    },
                    EnrollmentCustomerType.Residential)
            };
        private static Lucene.Net.Store.RAMDirectory directory;

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


        #region Additional test attributes
        //
        // You can use the following additional attributes as you write your tests:
        //
        // Use ClassInitialize to run code before running the first test in the class
        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext) 
        {
            var container = ContainerSetup.Create();
            directory = new Lucene.Net.Store.RAMDirectory();

            using (var builder = new IndexBuilder(directory, true))
            {
                builder.WriteIndex(data, "Test").Wait();
            }
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
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Residential, "3620").ToArray();
                Assert.AreEqual(data.First().Item1.Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNameCorrect()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Residential, "Huffines").ToArray();
                Assert.AreEqual(data.First().Item1.Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNumberAndName()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Residential, "3620 Huffines").ToArray();
                Assert.AreEqual(data.First().Item1.Address, results.First().Address);
            }
        }

        [TestMethod]
        public void StreetNumberAndNameSpellingError()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Residential, "3620 Hufines").ToArray();
                Assert.AreEqual(data.First().Item1.Address, results.First().Address);
            }
        }

        [TestMethod]
        public void EsiId()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Residential, "1234SAMPLE5678").ToArray();
                Assert.AreEqual(data.First().Item1.Address, results.First().Address);
            }
        }

        [TestMethod]
        public void WrongState()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("GA", EnrollmentCustomerType.Residential, "3620").ToArray();
                Assert.IsFalse(results.Any());
            }
        }

        [TestMethod]
        public void WrongCustomerType()
        {
            using (var searcher = new IndexSearcher(directory))
            {
                var results = searcher.Search("TX", EnrollmentCustomerType.Commercial, "3620").ToArray();
                Assert.IsFalse(results.Any());
            }
        }
    }
}
