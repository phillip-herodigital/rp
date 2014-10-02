using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using System.ComponentModel.DataAnnotations;

namespace StreamEnergy.MyStream.Models.Temp
{
    [Serializable]
    public class GenerateW9
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        [Required(ErrorMessage = " ")]
        public string Name { get; set; }

        [Required(ErrorMessage = " ")]
        public string BusinessName { get; set; }

        [Required(ErrorMessage = " ")]
        public PdfBusinessClassification BusinessClassification { get; set; }

        [Required(ErrorMessage = " ")]
        public string BusinessTypeAdditional { get; set; }

        [Required(ErrorMessage = " ")]
        public bool IsExempt { get; set; }

        [Required(ErrorMessage = " ")]
        public string Address { get; set; }

        [Required(ErrorMessage = " ")]
        public string City { get; set; }

        [Required(ErrorMessage = " ")]
        public string State { get; set; }

        [Required(ErrorMessage = " ")]
        public string Zip { get; set; }

        [Required(ErrorMessage = " ")]
        public string SocialSecurityNumber { get; set; }

        [Required(ErrorMessage = " ")]
        public string EmployerIdentificationNumber { get; set; }

        [Required(ErrorMessage = " ")]
        public string Signature { get; set; }
    }
}