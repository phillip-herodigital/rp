using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class OfferPayment
    {
        public string Description { get; set; }
        public decimal RequiredAmount { get; set; }
        public decimal OptionalAmount { get; set; }

    }
}
