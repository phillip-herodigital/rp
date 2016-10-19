using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkGasRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider
        {
            get
            {
                return PreviousProvider;
            }

            set
            {
                throw new NotImplementedException();
            }
        }
    }
}
