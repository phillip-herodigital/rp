using System.Collections.Generic;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class SmartyStreetsTypeAheadResponse
    {
        public IEnumerable<Suggestion> Suggestions { get; set; }

        public class Suggestion
        {
            public string text { get; set; }
            public string street_line { get; set; }
            public string city { get; set; }
            public string state { get; set; }
        }
    }
}