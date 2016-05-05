using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSubcategory
    {
        public List<FAQCategory> Categories;
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
        }
    }
}