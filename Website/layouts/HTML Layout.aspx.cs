using Sitecore.Globalization;
using Sitecore.Publishing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts
{
    public partial class HTML_Layout : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            return;
            PublishMode publishMode = PublishMode.Full;

            using (new Sitecore.SecurityModel.SecurityDisabler())
            {
                var webDb = Sitecore.Configuration.Factory.GetDatabase("web");
                var masterDb = Sitecore.Configuration.Factory.GetDatabase("master");

                try
                {
                    foreach (Language language in masterDb.Languages)
                    {
                        //loops on the languages and do a full republish on the whole sitecore content tree
                        var options = new PublishOptions(masterDb, webDb, publishMode, language, DateTime.Now) { RootItem = masterDb.Items["/sitecore"], RepublishAll = true, Deep = true };

                        var myPublisher = new Publisher(options);
                        myPublisher.Publish();
                    }
                }
                catch (Exception ex)
                {
                    Sitecore.Diagnostics.Log.Error("Could not publish", ex);
                }
            }
        }
    }
}