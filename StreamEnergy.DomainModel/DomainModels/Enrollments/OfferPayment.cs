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
        public string EnrollmentAccountNumber { get; set; }
        public IEnumerable<IOfferPaymentAmount> RequiredAmounts { get; set; }
        public IEnumerable<IOfferPaymentAmount> OngoingAmounts { get; set; }

    }
}
