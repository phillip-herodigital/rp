using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    abstract class OfferOptionRules : IOfferOptionRules
    {
        public abstract string OptionRulesType { get; }

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
