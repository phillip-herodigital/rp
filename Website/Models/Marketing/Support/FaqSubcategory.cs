using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSubcategory
    {
        public List<FAQCategory> Categories = new List<FAQCategory>();
        public string Guid;
        public string DisplayTitle;

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

            if (SitecoreItem.Fields["Categories"] != null && 
                !string.IsNullOrEmpty(SitecoreItem.Fields["Categories"].Value))
            {
                var cats = SitecoreItem.Fields["Categories"].Value.Split("|".ToCharArray());
                foreach (string c in cats)
                {
                    Categories.Add(new FAQCategory(Sitecore.Context.Database.GetItem(c)));
                }
            }
        }
    }
}