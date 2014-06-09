using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityOfferOption : IOfferOption
    {
        public const string Qualifier = "TexasElectricity";

        public DateTime ConnectDate { get; set; }

        void ISanitizable.Sanitize()
        {
        }

        string IOfferOption.OptionType
        {
            get { return TexasElectricityOfferOption.Qualifier; }
        }

    }
}
