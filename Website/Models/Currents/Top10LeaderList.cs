using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class TopLeaderList
    {

        public List<TopLeader> Top10 { get; set; }
        public List<TopLeader> Top15 { get; set; }
        public string ListDate { get; set; }
        public string ListDateText { get; set; }
    }
}