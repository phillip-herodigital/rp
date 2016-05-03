using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQCategory
    {
        private Item SitecoreItem;

        public string DisplayTitle;
        public string Name;
        public string Description;
        public string Link;
        public string Guid;
        public FAQCategory() { }
        public FAQCategory(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            DisplayTitle = getValue("Display Title");
            Name = getValue("Name");
            Description = getValue("Description");
            Guid = SitecoreItem.ID.ToString();
            //how do we want links/images to be passed over? - TODO
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key].Value;
        }


        public override string ToString()
        {
            try
            {
                JObject obj = new JObject
                {
                    { "name", Name }
                };

                return obj.ToString(Formatting.None);
            }
            catch (Exception ex) { }
            return base.ToString();
        }
    }
}