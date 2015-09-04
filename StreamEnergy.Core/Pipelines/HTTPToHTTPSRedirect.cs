using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;
using System.Text.RegularExpressions;

namespace StreamEnergy.Pipelines
{
    public class HTTPToHTTPSRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public class Injection
        {
            [Dependency]
            public HttpContextBase Context { get; set; }

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
            dependencies = injectedValue;
        }

        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            if (!HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled)
            {
                string url = dependencies.Context.Request.Url.ToString();
                Regex reg = new Regex("http:");
                url = reg.Replace(url, "https:", 1);

                if (url != dependencies.Context.Request.Url.ToString()) //In case HTTPS url returns non-secure connection for whatever reason
                {
                    dependencies.Context.Response.Redirect(url);
                }
            }
        }
    }
}