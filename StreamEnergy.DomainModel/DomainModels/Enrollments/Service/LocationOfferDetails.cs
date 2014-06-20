using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Service
{
    [Serializable]
    public class LocationOfferDetails<T>
    {
        public Location Location { get; set; }
        public IOffer Offer { get; set; }

        public T Details { get; set; }

    }
}
