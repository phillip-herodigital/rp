using Sitecore.SecurityModel;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Pipelines
{
    public class VanityUrlRedirect : Sitecore.Pipelines.HttpRequest.HttpRequestProcessor
    {
        public override void Process(Sitecore.Pipelines.HttpRequest.HttpRequestArgs args)
        {
            // If current item not available in Sitecore, then check if there is a vanity URL to redirect to
            if (Sitecore.Context.Item == null && Sitecore.Context.Database != null)
            {
                using (new SecurityDisabler())
                {
                    var vanityRedirectsItem = Sitecore.Context.Database.SelectSingleItem("fast://sitecore/content/data/Vanity Redirects");
                    if (vanityRedirectsItem != null)
                    {
                        var redirectItem = vanityRedirectsItem.Axes.GetChild(HttpContext.Current.Request.Url.AbsolutePath.Replace("/", ""));
                        if (redirectItem != null)
                        {
                            var field = (Sitecore.Data.Fields.LinkField)redirectItem.Fields["Redirect URL"];
                            if (field != null)
                            {
                                HttpContext.Current.Response.StatusCode = 302;
                                HttpContext.Current.Response.Redirect(field.GetFriendlyUrl(), true);
                            }
                        }
                    }
                }
            }
        }
    }
}