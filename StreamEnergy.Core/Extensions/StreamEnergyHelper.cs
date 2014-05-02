using Sitecore.Data.Fields;
using Sitecore.Data.Items;
using Sitecore.Mvc;
using Sitecore.Mvc.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;

namespace StreamEnergy.Extensions
{
    public class StreamEnergyHelper
    {
        private System.Web.Mvc.HtmlHelper htmlHelper;

        public StreamEnergyHelper(System.Web.Mvc.HtmlHelper htmlHelper)
        {
            this.htmlHelper = htmlHelper;
        }

    }
}
