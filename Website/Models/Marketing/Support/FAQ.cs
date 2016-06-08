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
        public List<string> Keywords = new List<string>();
        public List<string> RelatedFAQs = new List<string>();
        public List<FAQState> States = new List<FAQState>();

        public string Name;
        public string FAQQuestion;
        public string FAQAnswer;
        public string Description;
        public string FurtherSupportText;
        public string Guid;

        private Item SitecoreItem;

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
            Guid = SitecoreItem.ID.ToString();
            Guid = Guid.Replace("{", "");
            Guid = Guid.Replace("}", "");

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
                    Item r = Sitecore.Context.Database.GetItem(guid);
                    RelatedFAQs.Add(string.Format("{0}||{1}||{2}", getValueFromItem(r, "FAQ Name"), getValueFromItem(r, "FAQ Categories") , guid));
                }
            }

            if (!string.IsNullOrEmpty(getValue("FAQ States")))
            {
                var states = getValue("FAQ States").Split("|".ToCharArray()); ;
                foreach (string state in states)
                {
                    States.Add(new FAQState(state));
                }
            }
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key] != null ?  SitecoreItem.Fields[key].Value : "";
        }

        private string getValueFromItem(Item item, string key) {
            return item.Fields[key] != null ? item.Fields[key].Value : "";
        }
    }
}