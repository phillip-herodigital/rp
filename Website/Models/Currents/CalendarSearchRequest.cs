using Sitecore.Data.Items;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class CalendarSearchRequest
    {
        public string CategoryID { get; set; }
        public string State { get; set; }
        public string SearchText { get; set; }
    }
}