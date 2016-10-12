using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyGas
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "NewJerseyGasRenewal";

        public override string OptionType
        {
            get { return RenewalOfferOption.Qualifier; }
        }

    }
}
