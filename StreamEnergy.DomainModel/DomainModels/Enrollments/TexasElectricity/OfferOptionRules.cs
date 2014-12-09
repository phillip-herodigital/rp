using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    class OfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "TexasElectricity";

        public virtual string OptionRulesType { get { return OfferOptionRules.Qualifier; } }

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
