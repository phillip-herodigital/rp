using System;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaGas
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "PennsylvaniaGasRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
