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
        public string DeviceMake { get; set; }
        public string DeviceModel { get; set; }
        public string DeviceSerial { get; set; }
        public string SimNumber { get; set; }
        public string NewNumber { get; set; }
        public string PortInNumber { get; set; }
        public string PlanId { get; set; }
        public string AssociateId { get; set; }
        public string SourceId { get; set; }
        
        [Required(ErrorMessage = "Personal Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Billing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Billing Address ")]
        public Address BillingAddress { get; set; }

        [Required(ErrorMessage = "Shipping Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Shipping Address ")]
        public Address ShippingAddress { get; set; }
        public bool ShippingAddressSame { get; set; }

        [Required(ErrorMessage = "Business Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Business Address ")]
        public Address BusinessAddress { get; set; }
        public bool BusinessAddressSame { get; set; }

        [Required]
        public string BusinessInformationName { get; set; }
        public string BusinessName { get; set; }

        public W9BusinessClassification BusinessTaxClassification { get; set; }
        public string AdditionalTaxClassification { get; set; }
        public string ExemptCode { get; set; }
        public string FatcaCode { get; set; }

        public string CurrentAccountNumbers { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string TaxId { get; set; }
        [Required]
        public bool CustomerCertification { get; set; }
        [Required]
        public string CustomerSignature { get; set; }
        public string SignatureImage { get; set; }
        [Required]
        public bool SignatureConfirmation { get; set; }
        public string SignatoryName { get; set; }
        public string SignatoryRelation { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

        public bool TcpaPreference { get; set; }

        public string RestoreData { get; set; }

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
