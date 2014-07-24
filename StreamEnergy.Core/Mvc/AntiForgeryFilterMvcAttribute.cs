using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace StreamEnergy.Mvc
{
    class AntiForgeryFilterMvcAttribute : System.Web.Mvc.ActionFilterAttribute
    {
        public AntiForgeryFilterMvcAttribute()
        {
            CheckXsrfHeader = true;
        }

        public bool CheckXsrfHeader { get; set; }

        public override void OnActionExecuting(System.Web.Mvc.ActionExecutingContext filterContext)
        {
            if (filterContext.HttpContext.Request.HttpMethod == "GET")
            {
                string cookieToken, formToken;
                AntiForgery.GetTokens(null, out cookieToken, out formToken);

                filterContext.HttpContext.Response.AppendCookie(new System.Web.HttpCookie("XSRF-TOKEN", cookieToken + ":" + formToken)
                {
                    // It is the intention for this cookie to be read by the client script, but not cross-domain scripts
                    HttpOnly = false,
                    // It isn't necessary to keep this cookie secure over https - it contains no user information
                    Secure = false,
                });
            }
            else if (CheckXsrfHeader)
            {
                var values = filterContext.HttpContext.Request.Headers.GetValues("X-XSRF-TOKEN");
                if (values == null || values.Length != 1)
                {
                    filterContext.Result = new System.Web.Mvc.HttpStatusCodeResult(403);
                    return;
                }
                else
                {
                    var parts = values[0].Split(':');
                    if (parts.Length != 2)
                    {
                        filterContext.Result = new System.Web.Mvc.HttpStatusCodeResult(403);
                        return;
                    }

                    System.Web.Helpers.AntiForgery.Validate(parts[0], parts[1]);

                }
            }
            base.OnActionExecuting(filterContext);
        }
    }
}
