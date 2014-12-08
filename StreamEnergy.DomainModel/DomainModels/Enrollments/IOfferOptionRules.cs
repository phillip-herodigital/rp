using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOfferOptionRules
    {
        string OptionRulesType { get; }
        IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options);

        IOfferOption GetInitialOptions();
    }

}
