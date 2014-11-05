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

        [Required(ErrorMessage = "Shipping Address Required")]
        public Address ShippingAddress { get; set; }

        [Required(ErrorMessage = "Business Address Required")]
        public Address BusinessAddress { get; set; }

        [Required]
        public string BusinessInformationName { get; set; }

        public string BusinessName { get; set; }
        [Required]
        public W9BusinessClassification TaxClassification { get; set; }
        public string AdditionalTaxClassification { get; set; }
        [Required]
        public string ExemptCode { get; set; }
        [Required]
        public string FatcaCode { get; set; }
        [Required]
        public bool BusinessAddressSame { get; set; }

        public string CurrentAccountNumbers { get; set; }
        [Required]
        public DateTimeOffset CustomerCertification { get; set; }
        [Required]
        public string CustomerSignature { get; set; }
        [Required]
        public bool SignatureConfirmation { get; set; }
        [Required]
        public string SignatoryName { get; set; }
        [Required]
        public string SignatoryRelation { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public DateTimeOffset AgreeToTerms { get; set; }

        public bool TcpaPreference { get; set; }

        public byte[] PdfGen { get; set; }

        public string AssociateId { get; set; }
        public string SourceId { get; set; }
        public string OrderId { get; set; }
    }
}
