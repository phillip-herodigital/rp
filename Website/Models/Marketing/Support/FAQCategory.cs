using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Sitecore.Data.Fields;

namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQCategory
    {
        private Item SitecoreItem;

        public string Name;
        public string Description;
        public string ContactPageContent;
        public string EmergencyContactSubheading;
        public string EmergencyContactContent;
        public string ContactContent;
        public string Link;
        public IEnumerable<FAQState> States = new List<FAQState>();
        public string IconURL;
        public bool DisplayOnMainPage;
        public bool DisplayOnContactPage;

        public string Guid;
        public FAQCategory() { }
        public FAQCategory(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            Name = getValue("Name");
            Description = getValue("Description");
            ContactPageContent = getValue("Contact Page Content");
            EmergencyContactSubheading = getValue("Emergency Contact Subheading");
            EmergencyContactContent = getValue("Emergency Contact Content");
            ContactContent = getValue("Contact Content");
            Guid = SitecoreItem.ID.ToString();
            ImageField iconField = SitecoreItem.Fields["Icon"];
            if(iconField.MediaItem != null)
            {
                IconURL = Sitecore.Resources.Media.MediaManager.GetMediaUrl(iconField.MediaItem);
            }
            LinkField lf = SitecoreItem.Fields["Support Link"];
            if (lf != null) {
                Link = lf.GetFriendlyUrl();
            }
            //if (!string.IsNullOrEmpty(SitecoreItem.Fields["States"].Value)) {
            //    var states = getValue("States").Split("|".ToCharArray()); ;
            //    foreach (string state in states)
            //    {
            //        States.Add(new FAQState(state));
            //    }
            //}
            States = (from string stateGuid in getValue("States").Split("|".ToCharArray())
                      where !string.IsNullOrEmpty(stateGuid)
                      select new FAQState(stateGuid)).ToArray();
            CheckboxField MainPageField = SitecoreItem.Fields["Main Page"];
            DisplayOnMainPage = MainPageField.Checked;
            CheckboxField ContactPageField = SitecoreItem.Fields["Contact Page"];
            DisplayOnContactPage = ContactPageField.Checked;
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key].Value;
        }
    }
}