using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class OfferInformation
    {
        public IEnumerable<IOffer> AvailableOffers { get; set; }
        public IEnumerable<OfferSelection> OfferSelections { get; set; }
    }
}
