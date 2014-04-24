using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.Leaders
{
    public partial class View_All_Directors : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            cusDirectors.LeaderItems = Sitecore.Context.Item.Children.ToList();
        }
    }
}