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
    public class IndexBuilder
    {
        private LuceneStore.FSDirectory directory;

        public IndexBuilder(string destination)
        {
            System.IO.Directory.CreateDirectory(destination);
            directory = LuceneStore.FSDirectory.Open(destination);
        }

        public bool WriteIndex(IEnumerable<DomainModels.Enrollments.Location> locations)
        {
            Analyzer analyzer = new StandardAnalyzer(Lucene.Net.Util.Version.LUCENE_30);
            IndexWriter writer = new IndexWriter(directory, analyzer, true, IndexWriter.MaxFieldLength.UNLIMITED);

            foreach (var doc in locations.Select(ToDocument))
            {
                writer.AddDocument(doc);
            }

            writer.Optimize();
            writer.Close();
            return true;
        }

        private Document ToDocument(DomainModels.Enrollments.Location arg)
        {
            Document doc = new Document();

            doc.Add(new Field("State", 
                              arg.Address.StateAbbreviation.ToUpper(),
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));
            doc.Add(new Field("Canonical",
                              arg.Address.ToSingleLine(),
                              Field.Store.NO,
                              Field.Index.ANALYZED));
            doc.Add(new Field("Data",
                              Json.Stringify(arg),
                              Field.Store.YES,
                              Field.Index.NO));
            doc.Add(new Field("Exact",
                              string.Join(" ", arg.Capabilities.OfType<ISearchable>().Select(c => c.GetUniqueField()).Where(s => !string.IsNullOrEmpty(s))),
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));

            return doc;
        }
    }
}
