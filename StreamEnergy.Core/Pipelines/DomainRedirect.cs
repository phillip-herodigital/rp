using System;
using System.Web;
using Microsoft.Practices.Unity;
using System.Linq;
using System.Collections.Generic;
using Sitecore.Services.Core.ComponentModel;

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
                    string domain = HttpContext.Current.Request.Url.Host;
                    var redirects = (from line in settingsItem.Fields["Redirects"].Value.Split(new string[] { "\r\n", "\n" }, StringSplitOptions.RemoveEmptyEntries)
                                     let parts = line.Split(new string[] { "=>" }, StringSplitOptions.RemoveEmptyEntries)
                                     where parts.Length == 2
                                     select new KeyValuePair<string, string>(parts[0], parts[1])).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);
                    if (redirects.ContainsKey(domain))
                    {
                        if (redirects[domain].EndsWith("*"))
                        {
                            HttpContext.Current.Response.RedirectPermanent(redirects[domain].Replace("*", "") + HttpContext.Current.Request.Url.PathAndQuery);
                        }
                        else
                        {
                            HttpContext.Current.Response.RedirectPermanent(redirects[domain]);
                        }
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