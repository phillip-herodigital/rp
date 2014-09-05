using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class OfferSelection
    {
        public string OfferId { get; set; }
        public IOfferOptionRules OptionRules { get; set; }
        public IOfferOption OfferOption { get; set; }

        public OfferPayment Payments { get; set; }
        public bool ConfirmationSuccess { get; set; }
        public string ConfirmationNumber { get; set; }
    }
}
