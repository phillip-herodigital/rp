using Sitecore.Data.Items;
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
            var navs = new List<object>();
            var subNavs = new List<object>();

            var subnavNum = 0;
            foreach (var item in Sitecore.Context.Database.GetItem("/sitecore/content/Data/Navigation/Anonymous").Children.ToArray())
            {
                if (item.HasChildren)
                {
                    subnavNum++;
                    subNavs.Add(new
                    {
                        SubNavNum = subnavNum,
                        SubNavItems = from subitem in item.Children
                                      let subField = (Sitecore.Data.Fields.LinkField)subitem.Fields["Navigation Link"]
                                      where subField != null
                                      select new
                                      {
                                          URL = subField.Url,
                                          Text = subField.Text,
                                      },
                    });
                }
                var field = (Sitecore.Data.Fields.LinkField)item.Fields["Navigation Link"];
                navs.Add(new
                {
                    URL = field.Url,
                    Text = field.Text,
                    CssClass = (field.TargetItem.ID == Sitecore.Context.Item.ID) ? "selected" : "",
                    Item = item,
                    SubNavNum = subnavNum,
                    SubNavAttributes = item.HasChildren ? string.Format(@"ng-mouseover=""showSubnav({0})"" ng-mouseout=""hideSubnav()"" ng-class=""{{ selected: subnav == {0} }}""", subnavNum) : "",
                });
            }

            rptNavigationItems.DataSource = navs;
            rptNavigationItems.DataBind();

            rptSubNavs.DataSource = subNavs;
            rptSubNavs.ItemDataBound += rptSubNavs_ItemDataBound;
            rptSubNavs.DataBind();

            var imageField = (Sitecore.Data.Fields.ImageField)Sitecore.Context.Item.Fields["Banner Image"];
            if (imageField != null && imageField.MediaItem != null)
            {
                divBanner.Attributes["style"] = string.Format("background-image: url({0})", Sitecore.Resources.Media.MediaManager.GetMediaUrl(imageField.MediaItem));
            }
        }

        void rptSubNavs_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            Repeater rptSubNavItems = (Repeater)e.Item.FindControl("rptSubNavItems");
            rptSubNavItems.DataSource = ((dynamic)e.Item.DataItem).SubNavItems;
            rptSubNavItems.DataBind();
        }
    }
}