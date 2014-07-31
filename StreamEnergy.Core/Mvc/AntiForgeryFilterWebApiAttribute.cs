using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace StreamEnergy.Mvc
{
    class AntiForgeryFilterWebApiAttribute : System.Web.Http.Filters.ActionFilterAttribute
    {
        public override void OnActionExecuting(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            if (actionContext.Request.Method != HttpMethod.Get)
            {
                var values = actionContext.Request.Headers.GetValues("X-XSRF-TOKEN");
                if (values == null || values.Count() != 1)
                {
                    actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
                    return;
                }
                else
                {
                    var parts = values.First().Split(':');
                    if (parts.Length != 2)
                    {
                        actionContext.Response = new HttpResponseMessage(System.Net.HttpStatusCode.Forbidden);
                        return;
                    }

                    System.Web.Helpers.AntiForgery.Validate(parts[0], parts[1]);

                }
            }
            base.OnActionExecuting(actionContext);
        }

        public override void OnActionExecuted(System.Web.Http.Filters.HttpActionExecutedContext actionExecutedContext)
        {
            if (actionExecutedContext.Request.Method == HttpMethod.Get)
            {
                string cookieToken, formToken;
                AntiForgery.GetTokens(null, out cookieToken, out formToken);

                actionExecutedContext.Response.Headers.AddCookies(new[] { 
                    new CookieHeaderValue("XSRF-TOKEN", cookieToken + ":" + formToken)
                    {
                        // It is the intention for this cookie to be read by the client script, but not cross-domain scripts
                        HttpOnly = false,
                        // It isn't necessary to keep this cookie secure over https - it contains no user information
                        Secure = false,
                    }
                });
            }
            base.OnActionExecuted(actionExecutedContext);
        }
    }
}
