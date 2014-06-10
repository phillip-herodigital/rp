using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class EnrollmentLocation
    {
        public string Id { get; set; }
        public Location Location { get; set; }
        public IEnumerable<DomainModels.Enrollments.IOffer> AvailableOffers { get; set; }
        public IEnumerable<OfferSelection> OfferSelections { get; set; }
    }
}
