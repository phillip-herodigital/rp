using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class GridPromos : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var promoItems = new List<object>();
            var colors = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Colors").Children;

            foreach (var num in new string[] { "Promo One", "Promo Two", "Promo Three", "Promo Four" })
            {
                if (!string.IsNullOrEmpty(CurrentContextItem.Fields[num + " Header"].Value))
                {

                    var classes = new List<string>();

                    var accentColorField = CurrentContextItem.Fields[num + " Accent"];

                    if (colors.Any(c => c.Name == accentColorField.Value))
                    {
                        classes.Add("accent-" + colors.First(c => c.Name == accentColorField.Value).Fields["CSS Class"].Value);
                    }

                    promoItems.Add(new
                    {
                        Image = FieldRenderer.Render(CurrentContextItem, num + " Image"),
                        Header = FieldRenderer.Render(CurrentContextItem, num + " Header"),
                        Content = FieldRenderer.Render(CurrentContextItem, num + " Content"),
                        Button = FieldRenderer.Render(CurrentContextItem, num + " Button"),
                        CssClasses = string.Join(" ", classes),
                    });
                }
            }

            if (promoItems.Count == 3)
            {
                divGrid.Attributes["class"] += " three";
            }
            else if (promoItems.Count == 4)
            {
                divGrid.Attributes["class"] += " four";
            }
            
            rptPromoItems.DataSource = promoItems;
            rptPromoItems.DataBind();
        }
    }
}