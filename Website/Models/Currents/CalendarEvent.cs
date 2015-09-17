using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class CalendarEvent
    {
        public string Title { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public string EventDate { get; set; }
        public string ImageURL { get; set; }
        public string Location { get; set; }
        public string Summary { get; set; }
        public string MapLocation { get; set; }
        public string Category { get; set; }
        public string RegistrationURL { get; set; }
        public string RegistrationText { get; set; }
        public string MapButtonText { get; set; }
        public string InfoLinkURL { get; set; }
        public string InfoLinkText { get; set; }
        public IEnumerable<string> States { get; set; }
    }
}