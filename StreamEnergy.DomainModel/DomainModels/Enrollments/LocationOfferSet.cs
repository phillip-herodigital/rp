using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class LocationOfferSet
    {
        public LocationOfferSet()
        {
            OfferSetErrors = new Dictionary<string, string>();
            Offers = Enumerable.Empty<IOffer>();
        }

        public Dictionary<string, string> OfferSetErrors { get; private set; }
        public IEnumerable<IOffer> Offers { get; set; }
    }
}
