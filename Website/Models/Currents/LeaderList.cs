using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class LeaderList
    {
        public NameValueCollection RegionalDirectors { get; set; }
        public NameValueCollection ManagingDirectors { get; set; }
        public NameValueCollection SeniorDirectors { get; set; }
        public NameValueCollection ExecutiveDirectors { get; set; }
        public string ListDate { get; set; }
        public string ListDateText { get; set; }
    }
}