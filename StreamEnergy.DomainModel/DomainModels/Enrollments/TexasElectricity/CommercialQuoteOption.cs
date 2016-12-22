using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    public class CommercialQuoteOption : IOfferOption
    {
        public const string Qualifier = "TexasElectricityCommercialQuote";

        public DateTime ConnectDate { get; set; }

        void ISanitizable.Sanitize()
        {
        }

        public string PreviousProvider { get; set; }

        public string OptionType
        {
            get { return CommercialQuoteOption.Qualifier; }
        }
    }
}
