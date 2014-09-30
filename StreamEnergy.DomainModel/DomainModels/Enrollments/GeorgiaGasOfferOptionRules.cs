using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    class GeorgiaGasOfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "GeorgiaGas";

        public virtual string OptionRulesType { get { return GeorgiaGasOfferOptionRules.Qualifier; } }

        public virtual IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            return new IOfferPaymentAmount[0];
        }
    }
}
