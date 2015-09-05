using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.Practices.Unity;

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
            if (!dependencies.Context.Request.IsSecureConnection && dependencies.SSLEnabled)
            {
                string url = dependencies.Context.Request.Url.ToString().StartsWith("http:") ? 
                    "https:" + dependencies.Context.Request.Url.ToString().Substring(5) : dependencies.Context.Request.Url.ToString();
                dependencies.Context.Response.Redirect(url);
            }
        }
    }
}