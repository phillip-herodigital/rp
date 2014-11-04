using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class InstallationOfferPaymentAmount : IOfferPaymentAmount
    {
        public const string Qualifier = "InstallationFee";

        public string OfferPaymentAmountType
        {
            get { return Qualifier; }
        }

        public decimal DollarAmount { get; set; }
        public bool CanBeWaived { get { return false; } }

        public bool IsDollarAmountEstimated
        {
            get { return false; }
        }

    }
}
