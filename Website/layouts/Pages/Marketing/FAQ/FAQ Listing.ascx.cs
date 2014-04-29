using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.FAQ
{
    public partial class FAQ_Listing : System.Web.UI.UserControl
    {
        public List<Item> FAQItems
        {
            set
            {
                rptFAQs.DataSource = from item in value
                                     select new
                                     {
                                         Question = FieldRenderer.Render(item, "FAQ Question"),
                                         Answer = FieldRenderer.Render(item, "FAQ Answer"),
                                     };
                rptFAQs.DataBind();
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}