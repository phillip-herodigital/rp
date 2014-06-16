using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class CartEntry
    {
        public Location Location { get; set; }
        public KeyValuePair<string, OfferInformation>[] OfferInformationByType { get; set; }
    }
}
