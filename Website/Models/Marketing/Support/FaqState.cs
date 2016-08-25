using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
using Sitecore.Data.Fields;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQState
    {
        public string Name;
        public string Abbreviation;
        public string Guid;
        public string IconURL;
        public string EmergencyContactContent;
        public string ContactPageContent;
        public string ContactContent;

        public FAQState() { }

        public FAQState(string State, string Abbreviation) {
            this.Name = State;
            this.Abbreviation = Abbreviation;
        }

        public FAQState(string SitecoreID) {
            createState(Sitecore.Context.Database.GetItem(SitecoreID));
        }
        public FAQState(Item SitecoreItem) {
            createState(SitecoreItem);
        }

        private void createState(Item item)
        {
            Name = item.Fields["Name"].Value;
            Abbreviation = item.Fields["Abberviation"].Value;
            Guid = item.ID.ToString();
            ImageField iconField = item.Fields["Icon"];
            if (iconField.MediaItem != null)
            {
                IconURL = Sitecore.Resources.Media.MediaManager.GetMediaUrl(iconField.MediaItem);
            }
            EmergencyContactContent = getValue(item, "Emergency Contact Content", true);
            ContactPageContent = getValue(item, "Contact Page Content", true);
            ContactContent = getValue(item, "Contact Contact", true);
        }

        private string getValue(Item item, string key)
        {
            return getValue(item, key, false);
        }

        private string getValue(Item item, string key, bool encodeValue)
        {
            return item.Fields[key] != null ? (encodeValue ? HttpUtility.HtmlEncode(item.Fields[key].Value)
                                                 : item.Fields[key].Value)
                 : "";
        }
    }
}