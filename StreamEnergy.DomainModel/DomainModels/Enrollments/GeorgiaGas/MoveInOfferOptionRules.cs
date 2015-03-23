using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    class MoveInOfferOptionRules : OfferOptionRules
    {
        public const string Qualifier = "GeorgiaGasMoveIn";

        public override string OptionRulesType { get { return MoveInOfferOptionRules.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }

        public override IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            var typedOffer = options as MoveInOfferOption;
            return new IOfferPaymentAmount[]
            {
                new ConnectionFeePaymentAmount { DollarAmount = ConnectDates.AvailableConnectDates.First(d => d.Date == typedOffer.ConnectDate.Value.Date).Fees["ConnectFee"] },
            };
        }
    }
}
