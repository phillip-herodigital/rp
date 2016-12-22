using System;

namespace StreamEnergy.DomainModels.Enrollments.PennsylvaniaElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "PennsylvaniaElectricityRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
