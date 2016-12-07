using System.Collections.Generic;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class SmartyStreetsAddressLookupResponse
    {
        public string input_index { get; set; }
        public string candidate_index { get; set; }
        public string addressee { get; set; }
        public string delivery_line_1 { get; set; }
        public string delivery_line_2 { get; set; }
        public string last_line { get; set; }
        public string delivery_point_barcode { get; set; }
        public Components components { get; set; }
        public Metadata metadata { get; set; }
        public Analysis analysis { get; set; }
        
        public class Components
        {
            public string urbanization { get; set; }
            public string primary_number { get; set; }
            public string street_name { get; set; }
            public string street_predirection { get; set; }
            public string street_postdirection { get; set; }
            public string street_suffix { get; set; }
            public string secondary_number { get; set; }
            public string secondary_designator { get; set; }
            public string extra_secondary_number { get; set; }
            public string extra_secondary_designator { get; set; }
            public string pmb_designator { get; set; }
            public string pmb_number { get; set; }
            public string city_name { get; set; }
            public string default_city_name { get; set; }
            public string state_abbreviation { get; set; }
            public string zipcode { get; set; }
            public string plus4_code { get; set; }
            public string delivery_point { get; set; }
            public string delivery_point_check_digit { get; set; }

        }

        public class Metadata
        {
            public string record_type { get; set; }
            public string zip_type { get; set; }
            public string county_fips { get; set; }
            public string county_name { get; set; }
            public string carrier_route { get; set; }
            public string congressional_district { get; set; }
            public string building_default_indicator { get; set; }
            public string rdi { get; set; }
            public string elot_sequence { get; set; }
            public string elot_sort { get; set; }
            public string latitude { get; set; }
            public string longitude { get; set; }
            public string precision { get; set; }
            public string time_zone { get; set; }
            public string utc_offset { get; set; }
            public string dst { get; set; }
        }

        public class Analysis
        {
            public string dpv_match_code { get; set; }
            public string dpv_footnotes { get; set; }
            public string dpv_cmra { get; set; }
            public string dpv_vacant { get; set; }
            public string active { get; set; }
            public string ews_match { get; set; }
            public string footnotes { get; set; }
            public string lacslink_code { get; set; }
            public string lacslink_indicator { get; set; }
            public string suitelink_match { get; set; }
        }
    }
}