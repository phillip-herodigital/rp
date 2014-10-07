using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    class CommercialQuoteOptionRules : OfferOptionRules
    {
        public new const string Qualifier = "GeorgiaGasCommercialQuote";

        public override string OptionRulesType { get { return CommercialQuoteOptionRules.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }

        public override IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            var typedOffer = options as CommercialQuoteOption;
            return new IOfferPaymentAmount[]
            {
                new ConnectionFeePaymentAmount { DollarAmount = ConnectDates.AvailableConnectDates.First(d => d.Date == typedOffer.ConnectDate).Fees["ConnectFee"] },
            };
        }
    }
}
