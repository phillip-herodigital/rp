using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class LoadCalendarEvent
    {
        public string title { get; set; }
        public string startDate { get; set; }
        public string endDate { get; set; }
        public string eventDate { get; set; }
        public string imageURL { get; set; }
        public string location { get; set; }
        public string summary { get; set; }
        public string maplocation { get; set; }
        public string category { get; set; }
        public string registrationURL { get; set; }
        public string registrationText { get; set; }
        public string mapButtonText { get; set; }
        public string infoLinkURL { get; set; }
        public string infoLinkText { get; set; }
        public List<string> states { get; set; }
    }
}