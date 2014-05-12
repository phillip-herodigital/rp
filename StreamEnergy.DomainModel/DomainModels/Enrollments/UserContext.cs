using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class UserContext : ISanitizable
    {
        public bool IsNewService { get; set; }

        [Required(ErrorMessage = "Contact Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }

        [Required(ErrorMessage = "Service Capabilities Missing")]
        [EnumerableRequired(ErrorMessage = "Service Capabilities Missing")]
        [ValidateEnumerable(ErrorMessagePrefix = "Service Capabilities ")]
        public IEnumerable<IServiceCapability> ServiceCapabilities { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Secondary Contact ")]
        public CustomerName SecondaryContactInfo { get; set; }

        public string SocialSecurityNumber { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Drivers License ")]
        public DriversLicense DriversLicense { get; set; }
        /// <summary>
        /// ISO 639-1 codes, such as "en" and "es".
        /// </summary>
        public string Language { get; set; }

        [Required(ErrorMessage = "Billing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Billing Address ")]
        public Address BillingAddress { get; set; }

        [Required(ErrorMessage = "Selected Offers Required")]
        [EnumerableRequired(ErrorMessage = "Selected Offers Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Selected ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage = "Selected Offers Required")]
        public IEnumerable<SelectedOffer> SelectedOffers { get; set; }

        void ISanitizable.Sanitize()
        {
            if (SocialSecurityNumber != null)
                SocialSecurityNumber = System.Text.RegularExpressions.Regex.Replace(SocialSecurityNumber, "[^0-9]", "");
            if (Language != null)
                Language = Language.Trim();

            if (ContactInfo != null)
                ((ISanitizable)ContactInfo).Sanitize();
            if (SecondaryContactInfo != null)
                ((ISanitizable)SecondaryContactInfo).Sanitize();
            if (DriversLicense != null)
                ((ISanitizable)DriversLicense).Sanitize();
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
        }

    }
}
