using System;

namespace StreamEnergy.DomainModels.Enrollments.MarylandElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "MarylandElectricityRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
