using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Pipelines
{
    public class CurrentsUrlRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        private static ISettings settings = StreamEnergy.Unity.Container.Instance.Resolve<ISettings>();
        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            var host = HttpContext.Current.Request.Url.Host;
            var path = HttpContext.Current.Request.Url.AbsolutePath;
            if (!host.Contains("currents.igniteinc.com") && !path.StartsWith("/currents/") && path != "/currents")
            {
                return;
            }
            var item = settings.GetSettingsItem("Currents Redirect");
            if (item != null && !string.IsNullOrEmpty(item["Redirect Enabled"]) && !string.IsNullOrEmpty(item["Redirect Domain"]))
            {
                path = path.StartsWith("/currents/") ? path.Substring("/currents".Length) : "";
                HttpContext.Current.Response.StatusCode = 302;
                HttpContext.Current.Response.Redirect(item["Redirect Domain"] + path, true);
            }
        }
    }
}