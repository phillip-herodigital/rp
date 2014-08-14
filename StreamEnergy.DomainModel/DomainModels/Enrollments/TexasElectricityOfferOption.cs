using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityOfferOption : IOfferOption
    {
        public const string Qualifier = "TexasElectricity";

        [Required(ErrorMessage = "Billing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Billing Address ")]
        public Address BillingAddress { get; set; }

        void ISanitizable.Sanitize()
        {
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
        }

        public virtual string OptionType
        {
            get { return TexasElectricityOfferOption.Qualifier; }
        }

    }
}
