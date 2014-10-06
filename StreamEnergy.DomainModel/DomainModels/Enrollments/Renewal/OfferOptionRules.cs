using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Renewal
{
    [Serializable]
    class OfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "Renewal";

        public string OptionRulesType
        {
            get { return Qualifier; }
        }

        public IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            return new IOfferPaymentAmount[0];
        }
    }
}
