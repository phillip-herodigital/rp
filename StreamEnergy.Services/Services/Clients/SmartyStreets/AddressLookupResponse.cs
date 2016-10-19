using System.Collections.Generic;

namespace StreamEnergy.Services.Clients.SmartyStreets
{
    public class AddressLookupResponse
    {
        public DomainModels.Enrollments.Location location { get; set; }
        public Metadata metadata { get; set; }

        public class Metadata
        {
            public string text { get; set; }
            public string rdi { get; set; }
            public string record_type { get; set; }
        }
    }
}