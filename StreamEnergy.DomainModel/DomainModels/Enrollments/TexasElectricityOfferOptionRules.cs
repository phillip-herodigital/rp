using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class TexasElectricityOfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "TexasElectricity";

        public virtual string OptionRulesType { get { return TexasElectricityOfferOptionRules.Qualifier; } }

        public virtual IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            return new IOfferPaymentAmount[0];
        }
    }
}
