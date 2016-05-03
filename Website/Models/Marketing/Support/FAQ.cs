using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQ
    {
        public List<FAQCategory> Categories = new List<FAQCategory>();
        public List<FaqSubcategory> SubCategories = new List<FaqSubcategory>();
        protected List<string> Keywords = new List<string>();
        public List<FAQ> RelatedFAQs = new List<FAQ>();
        public string Name;
        public string FAQQuestion;
        public string FAQAnswer;
        public string Description;
        public string FurtherSupportText;

        public Item SitecoreItem;

        public FAQ(string SitecoreID) {
            SitecoreItem = Sitecore.Context.Database.GetItem(SitecoreID);
            buildFAQ();
        }

        public FAQ(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            buildFAQ();
        }
        private void buildFAQ() {
            Name = getValue("FAQ Name");
            FAQQuestion = getValue("FAQ Question");
            FAQAnswer = getValue("FAQ Answer");
            Description = getValue("Faq Description");
            FurtherSupportText = getValue("Further Support");

            if (!string.IsNullOrEmpty(getValue("FAQ Categories"))) {
                var cats = getValue("FAQ Categories").Split("|".ToCharArray());
                foreach (string c in cats) {
                    Categories.Add(new FAQCategory(Sitecore.Context.Database.GetItem(c)));
                }
            }

            if (!string.IsNullOrEmpty(getValue("FAQ Subcategories")))
            {
                var subcats = getValue("FAQ Subcategories").Split("|".ToCharArray());
                foreach (string s in subcats)
                {
                    SubCategories.Add(new FaqSubcategory(Sitecore.Context.Database.GetItem(s)));
                }
            }
            if (!string.IsNullOrEmpty(getValue("Keywords"))) {
                var kwords = getValue("Keywords").Split(",".ToCharArray());

                foreach (string keyword in kwords) {
                    Keywords.Add(keyword.Trim().ToLower());
                }
            }

            if (!string.IsNullOrEmpty(getValue("Related FAQs"))) {
                var related = getValue("Related FAQs").Split("|".ToCharArray());

                foreach (string guid in related) {
                    RelatedFAQs.Add(new FAQ(guid));
                }
            }
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key].Value;
        }
    }
}