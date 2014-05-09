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
        public UserContext()
        {
            SelectedOffers = new HashSet<IOffer>();
        }

        public bool IsNewService { get; set; }

        [Required(ErrorMessage = "Contact Info Required")]
        [ValidateObject(ErrorMessagePrefix = "Contact Info ")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Service Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Service Address ")]
        public Address ServiceAddress { get; set; }

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
        [ValidateEnumerable(ErrorMessagePrefix = "Selected Offers ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage="Selected Offer Required")]
        public HashSet<IOffer> SelectedOffers { get; private set; }

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
