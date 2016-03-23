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
            if (searcher != null)
            {
                return searcher.Search(state, customerType, query);
            }
            else
            {
                var response = new HttpClient().GetStringAsync(string.Format("https://test.mystream.com/api/address/lookup/{0}/{1}/{2}", state, customerType.ToString(), query)).Result;
                return StreamEnergy.Json.Read<IEnumerable<Location>>(response);
            }
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
