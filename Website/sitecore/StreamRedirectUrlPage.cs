using Sitecore.Data;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Collections.Specialized;

namespace StreamEnergy.MyStream.sitecore
{
    public class StreamRedirectUrlPage : Sitecore.EmailCampaign.Cd.sitecore.RedirectUrlPage
    {
        protected override void HandleMessageEvent(NameValueCollection queryString)
        {
            try
            {
                base.HandleMessageEvent(queryString);
            }
            catch
            {
                string ec_url = this.Context.Request.QueryString["ec_url"];
                base.Response.Status = "301 Moved Permanently";
                base.Response.AddHeader("Location", ec_url);
            }
        }
        /*
        protected override void OnFailed(object sender, System.EventArgs args)
		{
            try
            {
                base.OnFailed(sender, args);
            }
            catch
            {
                string ec_url = this.Context.Request.QueryString["ec_url"];
                base.Response.Status = "301 Moved Permanently";
                base.Response.AddHeader("Location", ec_url);
            }
		}
        */
    }
}