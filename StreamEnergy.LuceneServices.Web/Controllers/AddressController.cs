using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
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
        [Caching.CacheControl(MaxAgeInMinutes = 1440, IsPublic = true)]
        public IEnumerable<DomainModels.Enrollments.Location> Lookup(string state, string query)
        {
            return searcher.Search(state, query);
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 1440, IsPublic = true)]
        public HttpResponseMessage Lookup(string state, string query, string callback)
        {
            var result = Lookup(state, query);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(callback + "(" + StreamEnergy.Json.Stringify(result) + ")", Encoding.UTF8, "text/javascript")
            };
        }
    }
}
