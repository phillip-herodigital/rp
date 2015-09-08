using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;
using System.Text.RegularExpressions;
using ResponsivePath.Logging;

namespace StreamEnergy.Pipelines
{
    public class HTTPToHTTPSRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public class Injection
        {
            [Dependency("SSLEnabled")]
            public bool SSLEnabled { get; set; }
        }
        private Injection dependencies;
        public HTTPToHTTPSRedirect()
        {
            dependencies = StreamEnergy.Unity.Container.Instance.Unity.Resolve<Injection>();
        }
        public HTTPToHTTPSRedirect(Injection injectedValue)
        {
            try
            {
                dependencies = injectedValue;
            }
            catch (Exception)
            {
                // Eat errors
            }
        }

        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            try
            {
                if (!HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled)
                {
                    string url = HttpContext.Current.Request.Url.ToString();
                    Regex reg = new Regex("http:");
                    url = reg.Replace(url, "https:", 1);

                    if (url != HttpContext.Current.Request.Url.ToString()) //In case HTTPS url returns non-secure connection for whatever reason
                    {
                        HttpContext.Current.Response.Redirect(url);
                    }
                }
            }
            catch (Exception)
            {
                // Eat errors
            }
        }
    }
}