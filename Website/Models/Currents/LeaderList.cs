using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Currents
{
    public class LeaderList
    {
        public Sitecore.Data.Fields.DatasourceField RegionalDirectors { get; set; }
        public Sitecore.Data.Fields.DatasourceField ManagingDirectors { get; set; }
        public Sitecore.Data.Fields.DatasourceField SeniorDirectors { get; set; }
        public Sitecore.Data.Fields.DatasourceField ExecutiveDirectors { get; set; }
        public string ListDate { get; set; }
        public string ListDateText { get; set; }
    }
}