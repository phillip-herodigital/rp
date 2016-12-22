using System;

namespace StreamEnergy.DomainModels.Enrollments.DCElectricity
{
    [Serializable]
    public class RenewalOfferOption : OfferOption
    {
        public new const string Qualifier = "DCElectricityRenewal";

        public override string OptionType
        {
            get { return Qualifier; }
        }

        public override string PreviousProvider { get; set; }
    }
}
