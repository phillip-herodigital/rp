using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.Leaders
{
    public partial class Leader_Listing : BaseLayout
    {
        public List<Item> LeaderItems
        {
            set
            {
                rptLeaders.DataSource = from item in value
                                        select new
                                        {
                                            URL = Sitecore.Links.LinkManager.GetItemUrl(item),
                                            Image = FieldRenderer.Render(item, "Image", "w=182"),
                                            FirstName = FieldRenderer.Render(item, "First Name"),
                                            LastName = FieldRenderer.Render(item, "Last Name"),
                                            Location = FieldRenderer.Render(item, "Location"),
                                        };
                rptLeaders.DataBind();
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {
        }
    }
}