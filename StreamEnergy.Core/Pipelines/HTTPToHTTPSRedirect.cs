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
            [Dependency]
            public HttpContextBase Context { get; set; }

            [Dependency("SSLEnabled")]
            public bool SSLEnabled { get; set; }
            [Dependency]
            public ILogger logger { get; set; }
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
            dependencies.logger.Record("HTTPToHTTS Process Initiated", Severity.Debug);
            dependencies.logger.Record(string.Format("HTTPS Initial Condtion - !IsSecureConnection: {0}  -  SSLEnabled: {1}   -   Full Condition: {2}",
                !HttpContext.Current.Request.IsSecureConnection, dependencies.SSLEnabled, !HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled),
                Severity.Debug);

            if (!HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled)
            {
                string url = dependencies.Context.Request.Url.ToString();
                dependencies.logger.Record(string.Format("HTTPS Check URL: {0}", url), Severity.Debug);
                Regex reg = new Regex("http:");
                url = reg.Replace(url, "https:", 1);

                dependencies.logger.Record(string.Format("HTTPS url after replacement: {0}  -  Dependencies URL: {1}  ---  Is different from dependencies url:{2}",
                    url, dependencies.Context.Request.Url.ToString(), url != dependencies.Context.Request.Url.ToString()), Severity.Debug);

                if (url != dependencies.Context.Request.Url.ToString()) //In case HTTPS url returns non-secure connection for whatever reason
                {
                    dependencies.logger.Record(string.Format("Attempting redirect to: {0}", url), Severity.Debug);
                    //dependencies.Context.Response.Redirect(url);
                    HttpContext.Current.Response.Redirect(url);
                }
            }

            dependencies.logger.Record("HTTPToHTTS Process Exiting", Severity.Debug);
        }
    }
}