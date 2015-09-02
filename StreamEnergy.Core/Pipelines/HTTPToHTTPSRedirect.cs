using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Pipelines
{
    public class HTTPToHTTPSRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            var URL = HttpContext.Current.Request.Url;
            var SSLEnabled = !string.IsNullOrEmpty(System.Configuration.ConfigurationManager.AppSettings["SSLEnabled"]) &&
                bool.Parse(System.Configuration.ConfigurationManager.AppSettings["SSLEnabled"]);

            if (SSLEnabled && URL.OriginalString.Contains("http:"))
            {
                HttpContext.Current.Response.Redirect(URL.OriginalString.Replace("http:", "https:"), false);
            }
        }
    }
}