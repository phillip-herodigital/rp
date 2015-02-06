using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Lucene.Net.Analysis;
using Lucene.Net.Analysis.Standard;
using Lucene.Net.Documents;
using Lucene.Net.Index;
using Lucene.Net.Search;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using StreamEnergy.LuceneServices.Web.Models;
using LuceneStore = Lucene.Net.Store;

namespace StreamEnergy.LuceneServices.IndexGeneration
{
    public class IndexBuilder : IDisposable
    {
        private readonly List<Action> onDispose = new List<Action>();
        private IndexWriter writer;

        public IndexBuilder(LuceneStore.Directory directory, bool forceCreate)
        {
            Analyzer analyzer = AddressConstants.BuildLuceneAnalyzer();
            writer = new IndexWriter(directory, analyzer, forceCreate, IndexWriter.MaxFieldLength.UNLIMITED);
            onDispose.Add(((IDisposable)analyzer).Dispose);
            onDispose.Add(((IDisposable)writer).Dispose);
        }

        public async Task<bool> WriteLocation(Location location, EnrollmentCustomerType customerType, string group, bool isFresh, IEnumerable<string> additionalExactMatch = null)
        {
            
            return await Task.Run<bool>(() =>
            {
                if (!isFresh)
                {
                    var query = new BooleanQuery();
                    query.Add(new TermQuery(new Term("Group", group)), Occur.MUST);
                    query.Add(new TermQuery(new Term("Exact", GetExact(location))), Occur.MUST);
                    writer.DeleteDocuments(query);
                }

                writer.AddDocument(ToDocument(location, customerType, group, additionalExactMatch ?? Enumerable.Empty<string>()));
                return true;
            }).ConfigureAwait(false);
        }

        public async Task<bool> Optimize()
        {
            return await Task.Run(() =>
            {
                writer.Optimize();
                return true;
            }).ConfigureAwait(false);
        }

        public async Task<bool> WriteIndex(IEnumerable<Tuple<Location, EnrollmentCustomerType>> locations, string group)
        {
            foreach (var location in locations)
                await WriteLocation(location.Item1, location.Item2, group, false).ConfigureAwait(false);

            return await Optimize().ConfigureAwait(false);
        }

        private Document ToDocument(Location arg, EnrollmentCustomerType customerType, string group, IEnumerable<string> additionalExactMatches)
        {
            Document doc = new Document();

            arg.Capabilities = arg.Capabilities.Except(arg.Capabilities.OfType<CustomerTypeCapability>());
            var exact = GetExact(arg);

            // used for maintenance
            doc.Add(new Field("Group",
                              group,
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));
            doc.Add(new Field("CustomerType",
                              customerType.ToString(),
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));
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
            doc.Add(new Field("Exact",
                              exact,
                              Field.Store.NO,
                              Field.Index.NOT_ANALYZED_NO_NORMS));
            foreach (var additionalExact in additionalExactMatches)
            {
                doc.Add(new Field("Exact",
                                  additionalExact,
                                  Field.Store.NO,
                                  Field.Index.NOT_ANALYZED_NO_NORMS));
            }

            return doc;
        }

        private static string GetExact(Location arg)
        {
            var searchable = arg.Capabilities.OfType<ISearchable>().Select(c => c.GetUniqueField()).Where(s => !string.IsNullOrEmpty(s));
            var isZipCode = arg.Address.ToSingleLine() == arg.Address.PostalCode5;
            var exact = searchable.DefaultIfEmpty(isZipCode ? arg.Address.PostalCode5 : "");
            return string.Join(" ", exact);
        }

        void IDisposable.Dispose()
        {
            foreach (var action in onDispose)
            {
                action();
            }
        }

        internal void ClearGroup(string group)
        {
            writer.DeleteDocuments(new Term("Group", group));
        }
    }
}
