using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    [Serializable]
    public class UserContext : ISanitizable
    {
        [Required(ErrorMessage = "Personal Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Billing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Billing Address ")]
        public Address BillingAddress { get; set; }

        [Required(ErrorMessage = "Shipping Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Shipping Address ")]
        public Address ShippingAddress { get; set; }

        [Required(ErrorMessage = "Business Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Business Address ")]
        public Address BusinessAddress { get; set; }

        [Required]
        public string BusinessInformationName { get; set; }

        public string BusinessName { get; set; }
        [Required]
        public string TaxClassification { get; set; }
        [Required]
        public string ExemptCode { get; set; }
        [Required]
        public string FATCACode { get; set; }
        [Required]
        public bool BusinessAddressSame { get; set; }

        public string CurrentAccountNumbers { get; set; }
        [Required]
        public string SocialSecurityNumber { get; set; }
        [Required]
        public string TaxId { get; set; }
        [Required]
        public bool CustomerCertification { get; set; }
        [Required]
        public string CustomerSignature { get; set; }
        [Required]
        public bool SignatureConfirmation { get; set; }
        [Required]
        public string SignatoryName { get; set; }
        [Required]
        public string SignatoryRelation { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

        public bool TcpaPreference { get; set; }

        void ISanitizable.Sanitize()
        {
            if (ContactInfo != null)
                ((ISanitizable)ContactInfo).Sanitize();
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
            if (ShippingAddress != null)
                ((ISanitizable)ShippingAddress).Sanitize();
            if (BusinessAddress != null)
                ((ISanitizable)BusinessAddress).Sanitize();

        }

    }
}
