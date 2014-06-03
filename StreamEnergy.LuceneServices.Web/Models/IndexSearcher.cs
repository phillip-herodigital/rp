using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Lucene.Net.Index;
using Lucene.Net.Search;
using Lucene.Net.Search.Spans;
using LuceneStore = Lucene.Net.Store;

namespace StreamEnergy.LuceneServices.Web.Models
{
    public class IndexSearcher : IDisposable
    {
        private static readonly System.Text.RegularExpressions.Regex numeric = new System.Text.RegularExpressions.Regex("^[0-9]+$", System.Text.RegularExpressions.RegexOptions.Compiled);
        private readonly LuceneStore.FSDirectory directory;
        private readonly IndexReader reader;
        private readonly Lucene.Net.Search.IndexSearcher searcher;
        private readonly Lucene.Net.Analysis.Analyzer analyzer;

        public IndexSearcher(string source)
        {
            System.IO.Directory.CreateDirectory(source);
            directory = LuceneStore.FSDirectory.Open(source);
            reader = Lucene.Net.Index.IndexReader.Open(directory, readOnly: true);
            searcher = new Lucene.Net.Search.IndexSearcher(reader);
            analyzer = AddressConstants.BuildLuceneAnalyzer();
        }

        public IEnumerable<StreamEnergy.DomainModels.Enrollments.Location> Search(string state, string queryString)
        {
            var query = new BooleanQuery();
            query.Add(new TermQuery(new Term("State", state)), Occur.MUST);
            var exactOrSearchQuery = new BooleanQuery();
            query.Add(exactOrSearchQuery, Occur.MUST);

            // exact query
            exactOrSearchQuery.Add(new TermQuery(new Term("Exact", queryString)), Occur.SHOULD);

            // search query
            exactOrSearchQuery.Add(new AddressQueryParser("Canonical", analyzer).Parse(queryString), Occur.SHOULD);

            TopScoreDocCollector collector = TopScoreDocCollector.Create(10, true);
            searcher.Search(query, collector);
            ScoreDoc[] hits = collector.TopDocs().ScoreDocs;
            for (int i = 0; i < hits.Length; i++)
            {
                int docId = hits[i].Doc;
                float score = hits[i].Score;

                Lucene.Net.Documents.Document doc = searcher.Doc(docId);

                yield return Json.Read<StreamEnergy.DomainModels.Enrollments.Location>(doc.Get("Data"));

                // Simple heuristic to reduce match count when the top choices are a good match and the remaining ones aren't
                if (i < hits.Length - 1 && hits[i].Score > 0.5f && hits[i].Score * 0.5f > hits[i + 1].Score)
                    break;
            }
        }

        void IDisposable.Dispose()
        {
            searcher.Dispose();
            reader.Dispose();
            directory.Dispose();
        }
    }
}