using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using StreamEnergy.DomainModels;

namespace StreamEnergy.Data.MobileEnrollment
{
    public class EnrollmentRecord
    {
        public Guid Id { get; set; }

        [Required(ErrorMessage = "Name Required")]
        public Name Name { get; set; }

        [Required(ErrorMessage = "Phone Required")]
        public TypedPhone Phone { get; set; }

        [Required(ErrorMessage = "Email Required")]
        public Email Email { get; set; }

        [Required(ErrorMessage = "Billing Address Required")]
        public Address BillingAddress { get; set; }
        public bool BusinessAddressSame { get; set; }

        [Required(ErrorMessage = "Shipping Address Required")]
        public Address ShippingAddress { get; set; }
        public bool ShippingAddressSame { get; set; }

        [Required(ErrorMessage = "Business Address Required")]
        public Address BusinessAddress { get; set; }

        [Required]
        public string BusinessInformationName { get; set; }

        public string BusinessName { get; set; }
        [Required]
        public W9BusinessClassification TaxClassification { get; set; }
        public string AdditionalTaxClassification { get; set; }
        public string ExemptCode { get; set; }
        public string FatcaCode { get; set; }

        public string CurrentAccountNumbers { get; set; }
        public string SocialSecurityNumber { get; set; }
        public string TaxId { get; set; }
        [Required]
        public DateTimeOffset CustomerCertification { get; set; }
        [Required]
        public string CustomerSignature { get; set; }
        public byte[] SignatureImage { get; set; }
        [Required]
        public bool SignatureConfirmation { get; set; }
        public string SignatoryName { get; set; }
        public string SignatoryRelation { get; set; }

        public DateTimeOffset AgreeToTerms { get; set; }

        public bool TcpaPreference { get; set; }

        public byte[] PdfGen { get; set; }

        public string AssociateId { get; set; }
        public string SourceId { get; set; }
        public string OrderId { get; set; }

        public string Network { get; set; }

        public string NewDeviceSku { get; set; }
        public string BuyingOption { get; set; }
        public string Price { get; set; }
        public string Warranty { get; set; }

        public string DeviceMake { get; set; }

        public string DeviceModel { get; set; }

        public string DeviceColor { get; set; }

        public string DeviceSize { get; set; }

        public string DeviceSerial { get; set; }

        public string SimNumber { get; set; }

        public string NewNumber { get; set; }

        public string PortInNumber { get; set; }

        public string PreviousServiceProvider { get; set; }

        public string PlanId { get; set; }


    }
}
