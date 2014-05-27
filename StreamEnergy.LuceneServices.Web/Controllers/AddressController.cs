using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace StreamEnergy.LuceneServices.Web.Controllers
{
    public class AddressController : ApiController
    {
        private readonly Models.IndexSearcher searcher;

        public AddressController(Models.IndexSearcher searcher)
        {
            this.searcher = searcher;
        }

        [HttpGet]
        public IEnumerable<DomainModels.Enrollments.Location> Lookup(string state, string query)
        {
            return searcher.Search(state, query);
        }
    }
}
