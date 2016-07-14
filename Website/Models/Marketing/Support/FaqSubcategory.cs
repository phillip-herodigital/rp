using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FaqSubcategory
    {
        public IEnumerable<string> Categories = new List<string>();
        public string Guid;
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
            Guid = SitecoreItem.ID.ToString();
            Name = SitecoreItem.Fields["Name"].Value;
            Categories = (from string category in SitecoreItem.Fields["Categories"].Value.Split("|".ToCharArray())
                          select category).ToArray();
        }
    }
}