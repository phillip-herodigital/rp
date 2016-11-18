using System;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "NewYorkElectricityRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
