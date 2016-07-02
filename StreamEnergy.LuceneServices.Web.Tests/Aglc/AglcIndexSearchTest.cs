using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using Lucene.Net.Store;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.DomainModels.Enrollments.TexasElectricity;
using StreamEnergy.LuceneServices.IndexGeneration;
using StreamEnergy.LuceneServices.IndexGeneration.Ercot;
using StreamEnergy.LuceneServices.Web.Models;
using StreamEnergy.LuceneServices.Web.Tests.Ercot;

namespace StreamEnergy.LuceneServices.Web.Tests.Aglc
{
    /*
     * In order to run this you need to have an index
     */
    [TestClass]
    public class AglcIndexSearchTest
    {

        private TestContext testContextInstance;
        private static IndexSearcher oldIndex;
        private static IndexSearcher newIndex;

        private const string NewIndex = "New Index";
        private const string OldIndex = "Old Index";

        [ClassInitialize()]
        public static void MyClassInitialize(TestContext testContext)
        {
            var container = ContainerSetup.Create();

            oldIndex = new IndexSearcher(FSDirectory.Open(new DirectoryInfo(ConfigurationManager.AppSettings["LuceneIndexPath"])));
            newIndex = new IndexSearcher(FSDirectory.Open(new DirectoryInfo(ConfigurationManager.AppSettings["LuceneIndexPath2"])));
        }

        private static IEnumerable<Location> PerformSearch(IndexSearcher index, string query)
        {
            return index.Search("GA", EnrollmentCustomerType.Commercial, query);
        }

        /* deprecated
         * tests old index vs new index
        [TestMethod]
        public void TestPhrases()
        {
            CompareIndices("1020");
            CompareIndices("Eden");
            CompareIndices("1020 Eden");
            CompareIndices("1020 Eden SE"); // should fail
        }
         * */

        [TestMethod]
        public void TestOldIndex()
        {
            SearchIndex(oldIndex, "230 Newnan", OldIndex);
        }
        
        [TestMethod]
        public void TestNewIndex()
        {
            SearchIndex(newIndex, "1020 Eden SE", NewIndex);
        }

        private void SearchIndex(IndexSearcher searcher, string phrase, string label)
        {
            var results = PerformSearch(searcher, phrase);
            Assert.IsNotNull(results);
            PrintResultsToConsole(results, phrase, label);
        }

        private void CompareIndices(string phrase)
        {
            var oldResults = PerformSearch(oldIndex, phrase);
            var newResults = PerformSearch(newIndex, phrase);
            
            Assert.IsNotNull(oldResults);
            Assert.IsNotNull(newResults);

            //Assert.AreEqual(oldResults.Count(), newResults.Count());

            PrintResultsToConsole(oldResults, phrase, OldIndex);
            PrintResultsToConsole(newResults, phrase, NewIndex);   
        }

        private static void PrintResultsToConsole(IEnumerable<Location> results, string phrase, string label)
        {
            Console.Out.WriteLine("------------------------------------------------");
            Console.Out.WriteLine("Phrase: '{0}'", phrase);
            Console.Out.WriteLine("{0} Results:", label);
            if (results.Any())
            {
                foreach (var r in results)
                {
                    Console.Out.WriteLine("{0}", r.Address.ToSingleLine());
                }
            }
            else
            {
                Console.Out.WriteLine("None");
            }            
        }

        [ClassCleanup()]
        public static void MyClassCleanup()
        {
            ((IDisposable)oldIndex).Dispose();
            ((IDisposable)newIndex).Dispose();
        }
    }
}
