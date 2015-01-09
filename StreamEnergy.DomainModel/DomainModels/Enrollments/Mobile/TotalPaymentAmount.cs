using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
    public class TotalPaymentAmount : IInitialPaymentAmount
    {

        public const string Qualifier = "MobileTotal";

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

        public dynamic TaxTotal { get; set; }

        public dynamic SubTotal { get; set; }

        public string SystemOfRecord { get; set; }

        public string DepositAccount { get; set; }
    }
}
