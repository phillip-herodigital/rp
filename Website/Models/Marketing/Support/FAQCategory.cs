using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQCategory
    {
        public Item SitecoreItem;

        public string DisplayTitle;
        public string Name;
        public string Description;
        public string Link;

        public FAQCategory() { }
        public FAQCategory(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            DisplayTitle = getValue("Display Title");
            Name = getValue("Name");
            Description = getValue("Description");

            //how do we want links/images to be passed over? - TODO
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key].Value;
        }
    }
}