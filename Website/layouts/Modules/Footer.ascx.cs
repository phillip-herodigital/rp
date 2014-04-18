using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class Footer : System.Web.UI.UserControl
    {
        protected Item CurrentContextItem
        {
            get
            {
                Sublayout thisSublayout = (Parent as Sublayout);
                if (thisSublayout == null)
                    return Sitecore.Context.Item;
                if (string.IsNullOrEmpty(thisSublayout.DataSource))
                    return Sitecore.Context.Item;
                string dataSource = thisSublayout.DataSource;
                Item dataSourceItem = Sitecore.Context.Database.GetItem(dataSource) ??
                                      Sitecore.Context.ContentDatabase.GetItem(dataSource);
                if (dataSourceItem == null)
                    return Sitecore.Context.Item;
                return dataSourceItem;
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}