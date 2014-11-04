using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOfferPaymentAmount
    {
        string OfferPaymentAmountType { get; }
        /// <summary>
        /// This is either an exact amount (such as a monthly recurring specific charge) or estimated (such as based on estimated monthly usage)
        /// </summary>
        decimal DollarAmount { get; }
        bool CanBeWaived { get; }
        bool IsDollarAmountEstimated { get; }
    }
}
