using System;
using System.Web;
using Microsoft.Practices.Unity;
using Sitecore.Data.Fields;

namespace StreamEnergy.Pipelines
{
    public class DomainRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        private ISettings settings;
        public DomainRedirect()
        {
            this.settings = StreamEnergy.Unity.Container.Instance.Unity.Resolve<ISettings>();
        }

        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            try
            {
                Sitecore.Data.Items.Item settingsItem = settings.GetSettingsItem("Domain Redirect");
                if (!string.IsNullOrEmpty(settingsItem.Fields["Redirect Enabled"].Value))
                {
                    string domain = HttpContext.Current.Request.Url.Host.Replace(".", "_");
                    var redirects = ((NameValueListField)settingsItem.Fields["Redirects"]).NameValues;
                    if (!string.IsNullOrEmpty(redirects[domain]))
                    {
                        HttpContext.Current.Response.RedirectPermanent(HttpUtility.UrlDecode(redirects[domain]));
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