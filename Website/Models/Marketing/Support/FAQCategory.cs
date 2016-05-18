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

        public string DisplayTitle;
        public string Name;
        public string Description;
        public string Link;
        public List<FAQState> States = new List<FAQState>();
        public string IconURL;

        public string Guid;
        public FAQCategory() { }
        public FAQCategory(Item SitecoreItem) {
            this.SitecoreItem = SitecoreItem;
            DisplayTitle = getValue("Display Title");
            Name = getValue("Name");
            Description = getValue("Description");
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
            

            if (!string.IsNullOrEmpty(SitecoreItem.Fields["States"].Value)) {
                var states = getValue("States").Split("|".ToCharArray()); ;
                foreach (string state in states)
                {
                    States.Add(new FAQState(state));
                }
            }

            //how do we want links/images to be passed over? - TODO
        }

        private string getValue(string key) {
            return SitecoreItem.Fields[key].Value;
        }
    }
}