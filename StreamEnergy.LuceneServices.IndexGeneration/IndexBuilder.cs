using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using StreamEnergy.DomainModels;
using LuceneStore = Lucene.Net.Store;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    public class IndexBuilder : IDisposable
    {
        private LuceneStore.FSDirectory directory;
        private readonly List<Action> onDispose = new List<Action>();
        private IndexWriter writer;

        public IndexBuilder(string destination)
        {
            System.IO.Directory.CreateDirectory(destination);
            directory = LuceneStore.FSDirectory.Open(destination);

            Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);
            writer = new IndexWriter(directory, analyzer, true, IndexWriter.MaxFieldLength.UNLIMITED);
            onDispose.Add(((IDisposable)analyzer).Dispose);
            onDispose.Add(((IDisposable)writer).Dispose);
            onDispose.Add(((IDisposable)directory).Dispose);
        }

        public async Task<bool> WriteLocation(DomainModels.Enrollments.Location location)
        {
            return await Task.Run<bool>(() =>
            {
                writer.AddDocument(ToDocument(location));
                return true;
            });
        }

        public async Task<bool> Optimize()
        {
            return await Task.Run(() =>
            {
                writer.Optimize();
                return true;
            });
        }

        public async Task<bool> WriteIndex(IEnumerable<DomainModels.Enrollments.Location> locations)
        {
            foreach (var location in locations)
                await WriteLocation(location);

            return await Optimize();
        }

        private Document ToDocument(DomainModels.Enrollments.Location arg)
        {
            Document doc = new Document();

            doc.Add(new Field("State", 
                              arg.Address.StateAbbreviation.ToUpper(),
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));
            doc.Add(new Field("Canonical",
                              arg.Address.ToSingleLine().Replace(',', ' '),
                              Field.Store.NO,
                              Field.Index.ANALYZED));
            doc.Add(new Field("Data",
                              Json.Stringify(arg),
                              Field.Store.YES,
                              Field.Index.NO));
            var searchable = arg.Capabilities.OfType<ISearchable>().Select(c => c.GetUniqueField()).Where(s => !string.IsNullOrEmpty(s));
            var isZipCode = arg.Address.ToSingleLine() == arg.Address.PostalCode5;
            doc.Add(new Field("Exact",
                              string.Join(" ", searchable.DefaultIfEmpty(isZipCode ? arg.Address.PostalCode5 : "")),
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));

            return doc;
        }

        void IDisposable.Dispose()
        {
            foreach (var action in onDispose)
            {
                action();
            }
        }
    }
}
