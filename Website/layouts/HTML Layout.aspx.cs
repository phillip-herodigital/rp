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
        protected string BannerImageURL
        {
            get
            {
                var imageField = (Sitecore.Data.Fields.ImageField)Sitecore.Context.Item.Fields["Banner Image"];
                if (imageField == null || imageField.MediaItem == null)
                {
                    return "";
                }

                return Sitecore.Resources.Media.MediaManager.GetMediaUrl(imageField.MediaItem);
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            var ret = new List<object>();

            foreach (var item in Sitecore.Context.Database.GetItem("/sitecore/content/Data/Navigation/Anonymous").Children.ToArray())
            {
                var field = (Sitecore.Data.Fields.LinkField)item.Fields["Navigation Link"];
                ret.Add(new
                {
                    URL = field.Url,
                    Text = field.Text,
                    CssClass = (field.TargetItem.ID == Sitecore.Context.Item.ID) ? "selected" : ""
                });
            }

            rptNavigationItems.DataSource = ret;
            rptNavigationItems.DataBind();

            var imageField = (Sitecore.Data.Fields.ImageField)Sitecore.Context.Item.Fields["Banner Image"];
            if (imageField != null && imageField.MediaItem != null)
            {
                divBanner.Attributes["style"] = string.Format("background-image: url({0})", Sitecore.Resources.Media.MediaManager.GetMediaUrl(imageField.MediaItem));
            }
        }
    }
}