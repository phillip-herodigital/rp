﻿using Sitecore.Data.Items;
using Sitecore.Web.UI.WebControls;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class Intro : System.Web.UI.UserControl
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
        protected string ModuleCssClasses
        {
            get
            {
                var classes = new List<string>();

                var accentColorField = CurrentContextItem.Fields["Accent Color"];
                
                var colors = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Colors").Children;

                if (colors.Any(c => c.Name == accentColorField.Value))
                {
                    classes.Add("accent-" + colors.First(c => c.Name == accentColorField.Value).Fields["CSS Class"].Value);
                }

                return string.Join(" ", classes);
            }
        }
        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}