using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class GridPromos : BaseModule
    {
        protected List<object> PromoItems
        {
            get
            {
                var ret = new List<object>();

                if (!string.IsNullOrEmpty(CurrentContextItem.Fields["Promo One Header"].Value))
                {
                    ret.Add(new
                    {
                        Image = FieldRenderer.Render(CurrentContextItem, "Promo One Image"),
                        Header = FieldRenderer.Render(CurrentContextItem, "Promo One Header"),
                        Content = FieldRenderer.Render(CurrentContextItem, "Promo One Content"),
                        Button = FieldRenderer.Render(CurrentContextItem, "Promo One Button"),
                        Accent = FieldRenderer.Render(CurrentContextItem, "Promo One Accent"),
                    });
                }

                if (!string.IsNullOrEmpty(CurrentContextItem.Fields["Promo Two Header"].Value))
                {
                    ret.Add(new
                    {
                        Image = FieldRenderer.Render(CurrentContextItem, "Promo One Image"),
                        Header = FieldRenderer.Render(CurrentContextItem, "Promo One Header"),
                        Content = FieldRenderer.Render(CurrentContextItem, "Promo One Content"),
                        Button = FieldRenderer.Render(CurrentContextItem, "Promo One Button"),
                        Accent = FieldRenderer.Render(CurrentContextItem, "Promo One Accent"),
                    });
                }

                return ret;
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}