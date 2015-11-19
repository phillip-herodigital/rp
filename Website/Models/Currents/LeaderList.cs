using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class LeaderList
    {
        public List<KeyValuePair<string, string>> RegionalDirectors { get; set; }
        public List<KeyValuePair<string, string>> ManagingDirectors { get; set; }
        public List<KeyValuePair<string, string>> SeniorDirectors { get; set; }
        public List<KeyValuePair<string, string>> ExecutiveDirectors { get; set; }
        public string ListDate { get; set; }
        public string ListDateText { get; set; }
    }
}