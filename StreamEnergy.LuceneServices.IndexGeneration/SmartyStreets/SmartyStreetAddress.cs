using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.LuceneServices.IndexGeneration.SmartyStreets
{
    public class SmartyStreetAddress
    {
        public string PrimaryNumber { get; set; }

        public string StreetName { get; set; }

        public string StreetSuffix { get; set; }

        public string SecondaryNumber { get; set; }

        public string SecondaryDesignator { get; set; }

        public string CityName { get; set; }

        public string StateAbbreviation { get; set; }

        public string Zipcode { get; set; }

        public string Plus4Code { get; set; }
    }
}
