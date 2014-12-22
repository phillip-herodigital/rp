using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.GeorgiaGas
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public const string Qualifier = "GeorgiaGasRenewal";

        public override string OptionType
        {
            get { return RenewalOfferOption.Qualifier; }
        }

    }
}
