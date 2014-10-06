using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Renewal
{
    [Serializable]
    public class OfferOption : IOfferOption
    {
        public const string Qualifier = "Renewal";

        public string OptionType
        {
            get { return OfferOption.Qualifier; }
        }

        public DateTime RenewalDate { get; set; }

        void ISanitizable.Sanitize()
        {
        }
    }
}
