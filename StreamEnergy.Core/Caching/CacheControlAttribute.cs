using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Caching
{
    /// <summary>
    /// Specifies cache-control headers for the WebApi. This class intentionally does not implement System.Web.Mvc.IActionFilter because it could be used for parital views, 
    /// and I did not look to implement those at this time.
    /// </summary>
    public class CacheControlAttribute : System.Web.Http.Filters.ActionFilterAttribute, System.Web.Http.Filters.IActionFilter
    {
        public bool IsPublic { get; set; }
        public float MaxAgeInMinutes { get; set; }

        public TimeSpan GetMaxAge()
        {
            return TimeSpan.FromMinutes(MaxAgeInMinutes);
        }

        bool System.Web.Http.Filters.IFilter.AllowMultiple
        {
            get { return false; }
        }
        
        async Task<System.Net.Http.HttpResponseMessage> System.Web.Http.Filters.IActionFilter.ExecuteActionFilterAsync(System.Web.Http.Controllers.HttpActionContext actionContext, System.Threading.CancellationToken cancellationToken, Func<Task<System.Net.Http.HttpResponseMessage>> continuation)
        {
            var response = await continuation();
            var cache = response.Headers.CacheControl = new System.Net.Http.Headers.CacheControlHeaderValue();

            if (MaxAgeInMinutes <= 0)
            {
                cache.NoCache = true;
                cache.MaxAge = TimeSpan.Zero;
            }
            else
            {
                cache.MaxAge = GetMaxAge();
                cache.Private = !IsPublic;
                cache.Public = IsPublic;
            }

            return response;
        }
    }
}
