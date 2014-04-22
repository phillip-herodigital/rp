using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Website.layouts.Modules
{
    public partial class Full_HTML : BaseLayout
    {
        protected string ModuleCssClasses
        {
            get
            {
                var classes = new List<string>();

                var backgroundColorField = CurrentContextItem.Fields["Background Color"];
                var accentColorField = CurrentContextItem.Fields["Accent Color"];

                var colors = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Modules/Colors").Children;

                if (colors.Any(c => c.Name == backgroundColorField.Value))
                {
                    classes.Add("bg-" + colors.First(c => c.Name == backgroundColorField.Value).Fields["CSS Class"].Value);
                }

                if (colors.Any(c => c.Name == accentColorField.Value))
                {
                    classes.Add("accent-" + colors.First(c => c.Name == accentColorField.Value).Fields["CSS Class"].Value);
                }

                if (!string.IsNullOrEmpty(CurrentContextItem.Fields["Custom CSS Class"].Value))
                {
                    classes.Add(CurrentContextItem.Fields["Custom CSS Class"].Value);
                }

                return string.Join(" ", classes);
            }
        }

        protected void Page_Load(object sender, EventArgs e)
        {

        }
    }
}