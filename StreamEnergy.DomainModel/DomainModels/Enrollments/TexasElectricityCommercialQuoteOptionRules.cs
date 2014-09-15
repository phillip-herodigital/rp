﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class TexasElectricityCommercialQuoteOptionRules : TexasElectricityOfferOptionRules
    {
        public new const string Qualifier = "TexasElectricityCommercialQuote";

        public override string OptionRulesType { get { return TexasElectricityCommercialQuoteOptionRules.Qualifier; } }

        public IConnectDatePolicy ConnectDates { get; set; }

        public override IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            var typedOffer = options as TexasElectricityCommercialQuoteOption;
            return new IOfferPaymentAmount[]
            {
                new InstallationOfferPaymentAmount { DollarAmount = ConnectDates.AvailableConnectDates.First(d => d.Date == typedOffer.ConnectDate).Fees["ConnectFee"] },
            };
        }
    }
}
