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
    public class ImpersonateRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            try
            {
                string url = HttpContext.Current.Request.Url.ToString();
                
                if (url.Contains("/api/authentication/impersonate"))
                {
                    url = url.Replace("/api/authentication/impersonate", "/api/streamauthentication/impersonate");

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