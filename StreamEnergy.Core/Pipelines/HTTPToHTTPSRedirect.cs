﻿using Sitecore.SecurityModel;
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
                string url = HttpContext.Current.Request.Url.ToString();
                Regex reg2 = new Regex("://www\\.", RegexOptions.IgnoreCase);

                if (reg2.IsMatch(url) || (!HttpContext.Current.Request.IsSecureConnection && dependencies.SSLEnabled))
                {
                    Regex reg = new Regex("^http:");
                    url = reg.Replace(url, "https:");
                    Regex reg3 = new Regex("^https://www\\.", RegexOptions.IgnoreCase);
                    url = reg3.Replace(url, "https://");

                    if (url != HttpContext.Current.Request.Url.ToString())
                    {
                        HttpContext.Current.Response.RedirectPermanent(url);
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