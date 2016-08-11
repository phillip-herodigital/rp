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

        public string FAQQuestion;
        public string FAQAnswer;
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
            Encoding iso = Encoding.GetEncoding("ISO-8859-1");
            Encoding utf8 = Encoding.UTF8;
            FAQQuestion = utf8.GetString(iso.GetBytes(getValue("FAQ Question", true))); //to avoid weird copy/paste characters
            FAQAnswer = utf8.GetString(iso.GetBytes(getValue("FAQ Answer", true)));
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
                            select HttpUtility.HtmlEncode(keyword).Trim()).ToArray();
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

        private string getValue(string key)
        {
            return getValue(key, false);
        }

        private string getValue(string key, bool encodeValue)
        {
            return getValueFromItem(SitecoreItem, key, encodeValue);
        }

        private string getValueFromItem(Item item, string key)
        {
            return getValueFromItem(item, key, false);
        }

        private string getValueFromItem(Item item, string key, bool encodeValue)
        {
            return item.Fields[key] == null ? "" : (encodeValue ? HttpUtility.HtmlEncode(item.Fields[key].Value) : item.Fields[key].Value);
        }
    }
}