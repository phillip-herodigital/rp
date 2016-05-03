using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Sitecore.Data.Items;
namespace StreamEnergy.MyStream.Models.Marketing.Support
{
    public class FAQState
    {
        public string State;
        public string Abbreviation;
        public string Guid;

        public FAQState() { }

        public FAQState(string State, string Abbreviation) {
            this.State = State;
            this.Abbreviation = Abbreviation;
        }

        public FAQState(string SitecoreID) {
            createState(Sitecore.Context.Database.GetItem(SitecoreID));
        }
        public FAQState(Item SitecoreItem) {
            createState(SitecoreItem);
        }

        private void createState(Item item) {
            State = item.Fields["State Name"].Value;
            Abbreviation = item.Fields["State Abberviation"].Value;
            Guid = item.ID.ToString();
        }
    }
}