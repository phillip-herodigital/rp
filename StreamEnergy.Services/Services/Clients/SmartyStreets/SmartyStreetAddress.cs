using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using log4net;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class SmartyStreetAddress
    {
        private static readonly ILog Log = LogManager.GetLogger(typeof(SmartyStreetAddress));

        public string PrimaryNumber { get; set; }

        public string StreetPredirection { get; set; }

        public string StreetName { get; set; }

        public string StreetSuffix { get; set; }

        public string StreetPostdirection { get; set; }

        public string SecondaryNumber { get; set; }

        public string SecondaryDesignator { get; set; }

        public string CityName { get; set; }

        public string StateAbbreviation { get; set; }

        public string Zipcode { get; set; }

        public string Plus4Code { get; set; }
    }
}
