using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    [Serializable]
    public class TotalPaymentAmount : IInitialPaymentAmount
    {

        public const string Qualifier = "ProtectiveTotal";

        public string OfferPaymentAmountType
        {
            get { return Qualifier; }
        }

        public decimal DollarAmount { get; set; }

        public bool CanBeWaived
        {
            get { return false; }
        }

        public bool IsDollarAmountEstimated
        {
            get { return false; }
        }

        public decimal TaxTotal { get; set; }

        public decimal SubTotal { get; set; }

        public string SystemOfRecord { get; set; }

        public string DepositAccount { get; set; }

        public decimal DepositAlternativeAmount { get; set; }
    }
}
