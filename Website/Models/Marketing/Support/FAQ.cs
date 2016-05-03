using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQ
    {
        public List<FAQCategory> Categories;
        public List<FaqSubcategory> SubCategories;
        public string Name;
        public Item SitecoreItem;
        public FAQ() {
        }

        public FAQ(string SitecoreID) {
            SitecoreItem = Sitecore.Context.Database.GetItem(SitecoreID);

            buildFAQ();
        }

        public FAQ(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
        }
        private void buildFAQ() {
            string cats = SitecoreItem.Fields["FAQ Categories"].Value;
            string subcats = SitecoreItem.Fields["FAQ Subcategories"].Value;

            if (!string.IsNullOrEmpty(cats)) {
                foreach (string c in cats.Split("|".ToCharArray())) {
                    Categories.Add(new FAQCategory(Sitecore.Context.Database.GetItem(c)));
                }
            }

            if (!string.IsNullOrEmpty(subcats))
            {
                foreach (string s in subcats.Split("|".ToCharArray()))
                {
                    SubCategories.Add(new FaqSubcategory(Sitecore.Context.Database.GetItem(s)));
                }
            }
        }
    }
}