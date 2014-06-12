using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class SelectedOffers
    {
        public IEnumerable<SelectedOfferSet> Selection { get; set; }
    }
}