using StreamEnergy.DomainModels.Accounts;
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
        public IEnumerable<IOfferPaymentAmount> PostBilledAmounts { get; set; }
        public List<AvailablePaymentMethod> AvailablePaymentMethods { get; set; }
    }
}
