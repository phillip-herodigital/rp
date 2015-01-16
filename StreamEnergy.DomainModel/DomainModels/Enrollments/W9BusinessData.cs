using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class W9BusinessData
    {
        [ValidateObject(ErrorMessagePrefix = "Address ")]
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
        public bool CustomerCertification { get; set; }
        [Required]
        public string CustomerSignature { get; set; }
        public byte[] SignatureImage { get; set; }
        public bool SignatureConfirmation { get; set; }
        public string SignatoryName { get; set; }
        public string SignatoryRelation { get; set; }
    }
}
