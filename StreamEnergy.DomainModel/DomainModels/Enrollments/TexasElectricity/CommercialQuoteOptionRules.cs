using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    class CommercialQuoteOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "TexasElectricityCommercialQuote";

        public virtual string OptionRulesType { get { return Qualifier; } }

        public virtual IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            return new IOfferPaymentAmount[0];
        }
        public virtual IOfferOption GetInitialOptions()
        {
            return null;
        }
    }
}
