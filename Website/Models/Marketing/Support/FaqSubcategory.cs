using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSubcategory
    {
        public List<string> Categories = new List<string>();
        public string Guid;
        public string DisplayTitle;
        public string Name;

        private Item SitecoreItem;
        public FaqSubcategory() {
            buildSubCategory();
        }

        public FaqSubcategory(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            buildSubCategory();
        }

        private void buildSubCategory() {
            this.Guid = SitecoreItem.ID.ToString();

            DisplayTitle = SitecoreItem.Fields["Display Title"].Value;
            Name = SitecoreItem.Fields["Name"].Value;

            if (SitecoreItem.Fields["Categories"] != null && 
                !string.IsNullOrEmpty(SitecoreItem.Fields["Categories"].Value))
            {
                var cats = SitecoreItem.Fields["Categories"].Value.Split("|".ToCharArray());
                foreach (string c in cats)
                {
                    Categories.Add(Sitecore.Context.Database.GetItem(c).ID.ToString());
                }
            }
        }
    }
}