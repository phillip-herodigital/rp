using Sitecore.Data.Fields;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Pages.Marketing.Leaders
{
    public partial class Leaders_Landing : BaseLayout
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            var presidentialDirectorsField = (MultilistField)Sitecore.Context.Item.Fields["Presidential Directors"];

            cusPresidentialDirectors.LeaderItems = (from id in presidentialDirectorsField.TargetIDs
                                                    select Sitecore.Context.Database.Items[id]).ToList();

            var executiveDirectorsField = (MultilistField)Sitecore.Context.Item.Fields["Executive Directors"];

            cusExecutiveDirectors.LeaderItems = (from id in executiveDirectorsField.TargetIDs
                                                    select Sitecore.Context.Database.Items[id]).ToList();
        }
    }
}