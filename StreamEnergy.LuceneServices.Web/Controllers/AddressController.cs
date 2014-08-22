using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.LuceneServices.Web.Controllers
{
    [RoutePrefix("api/address")]
    public class AddressController : ApiController
    {
        private readonly Models.IndexSearcher searcher;

        public AddressController(Models.IndexSearcher searcher)
        {
            this.searcher = searcher;
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 1440, IsPublic = true)]
        [Route("lookup/{state}/{customerType}/{*query}")]
        public IEnumerable<Location> Lookup(string state, EnrollmentCustomerType customerType, string query)
        {
            return searcher.Search(state, customerType, query);
        }

        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 1440, IsPublic = true)]
        [Route("lookup/{state}/{customerType}/{*query}")]
        public HttpResponseMessage Lookup(string state, EnrollmentCustomerType customerType, string query, string callback)
        {
            var result = Lookup(state, customerType, query);
            return new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(callback + "(" + StreamEnergy.Json.Stringify(result) + ")", Encoding.UTF8, "text/javascript")
            };
        }
    }
}
