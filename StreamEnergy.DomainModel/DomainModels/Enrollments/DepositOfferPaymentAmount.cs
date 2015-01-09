using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class DepositOfferPaymentAmount : IInitialPaymentAmount
    {
        public const string Qualifier = "Deposit";

        public string OfferPaymentAmountType
        {
            get { return Qualifier; }
        }

        public decimal DollarAmount { get; set; }
        public bool CanBeWaived { get { return true; } }

        public bool IsDollarAmountEstimated
        {
            get { return false; }
        }

        public string SystemOfRecord { get; set; }
        public string DepositAccount { get; set; }
    }
}
