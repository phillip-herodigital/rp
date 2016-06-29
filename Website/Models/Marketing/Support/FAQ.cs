using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
using System.Text;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQ
    {
        public IEnumerable<string> Categories = new string[] { };
        public IEnumerable<string> SubCategories = new string[] { };
        public IEnumerable<string> Keywords = new string[] { };
        public IEnumerable<string> RelatedFAQs = new string[] { };
        public IEnumerable<string> States = new string[] { };

        public string Name;
        public string FAQQuestion;
        public string FAQAnswer;
        public string Description;
        public string FurtherSupportText;
        public string Guid;

        private Item SitecoreItem;

        public FAQ(string SitecoreID)
        {
            SitecoreItem = Sitecore.Context.Database.GetItem(SitecoreID);
            buildFAQ();
        }

        public FAQ(Item SitecoreItem)
        {
            this.SitecoreItem = SitecoreItem;
            buildFAQ();
        }
        private void buildFAQ()
        {
            Name = getValue("FAQ Name");
            Encoding iso = Encoding.GetEncoding("ISO-8859-1");
            Encoding utf8 = Encoding.UTF8;
            string Question1 = HttpUtility.HtmlEncode(getValue("FAQ Question"));
            string Question2 = utf8.GetString(iso.GetBytes(Question1));
            FAQQuestion = Question2; //to avoid weird copy/paste characters
            string Answer1 = HttpUtility.HtmlEncode(getValue("FAQ Answer"));
            string Answer2 = utf8.GetString(iso.GetBytes(Answer1));
            FAQAnswer = Answer2;
            Description = getValue("Faq Description");
            FurtherSupportText = getValue("Further Support");

            Guid = SitecoreItem.ID.ToString().Replace("{", "").Replace("}", "");

            if (!string.IsNullOrEmpty(getValue("FAQ Categories")))
            {
                Categories = (from guid in getValue("FAQ Categories").Split('|')
                              let category = Sitecore.Context.Database.GetItem(guid)
                              select string.Format("{0}|{1}", getValueFromItem(category, "Display Title"), guid)).ToArray();
            }

            if (!string.IsNullOrEmpty(getValue("FAQ Subcategories")))
            {
                SubCategories = getValue("FAQ Subcategories").Split('|');
            }
            if (!string.IsNullOrEmpty(getValue("Keywords")))
            {
                Keywords = (from keyword in getValue("Keywords").Split(',')
                            select keyword.Trim()).ToArray();
            }

            if (!string.IsNullOrEmpty(getValue("Related FAQs")))
            {
                RelatedFAQs = (from guid in getValue("Related FAQs").Split('|')
                               let r = Sitecore.Context.Database.GetItem(guid)
                               select string.Format("{0}||{1}||{2}", getValueFromItem(r, "FAQ Name"), getValueFromItem(r, "FAQ Categories"), guid)).ToArray();
            }

            if (!string.IsNullOrEmpty(getValue("FAQ States")))
            {
                States = getValue("FAQ States").Split('|');
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