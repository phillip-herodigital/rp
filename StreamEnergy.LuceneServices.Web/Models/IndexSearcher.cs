using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lucene.Net.Index;
using Lucene.Net.Search;
using LuceneStore = Lucene.Net.Store;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public class IndexSearcher : IDisposable
    {
        private readonly LuceneStore.FSDirectory directory;
        private readonly Lucene.Net.Search.IndexSearcher searcher;

        public IndexSearcher(string source)
        {
            System.IO.Directory.CreateDirectory(source);
            directory = LuceneStore.FSDirectory.Open(source);
            searcher = new Lucene.Net.Search.IndexSearcher(Lucene.Net.Index.IndexReader.Open(directory, true));
        }

        public IEnumerable<StreamEnergy.DomainModels.Enrollments.Location> Search(string state, string queryString)
        {
            var query = new BooleanQuery();
            query.Add(new TermQuery(new Term("State", state)), Occur.MUST);
            var exactOrSearchQuery = new BooleanQuery();
            query.Add(exactOrSearchQuery, Occur.MUST);

            // exact query
            exactOrSearchQuery.Add(new TermQuery(new Term("Exact", queryString)), Occur.SHOULD);

            var searchQuery = new BooleanQuery();
            exactOrSearchQuery.Add(searchQuery, Occur.SHOULD);
            foreach (var part in queryString.Split(' '))
            {
                if (!string.IsNullOrEmpty(part))
                {
                    searchQuery.Add(new FuzzyQuery(new Term("Canonical", part)), Occur.SHOULD);
                }
            }

            TopScoreDocCollector collector = TopScoreDocCollector.Create(10, true);
            searcher.Search(query, collector);
            ScoreDoc[] hits = collector.TopDocs().ScoreDocs;
            for (int i = 0; i < hits.Length; i++)
            {
                int docId = hits[i].Doc;
                float score = hits[i].Score;

                Lucene.Net.Documents.Document doc = searcher.Doc(docId);

                yield return Json.Read<StreamEnergy.DomainModels.Enrollments.Location>(doc.Get("Data"));
            }
        }

        void IDisposable.Dispose()
        {
            searcher.Dispose();
            directory.Dispose();
        }
    }
}