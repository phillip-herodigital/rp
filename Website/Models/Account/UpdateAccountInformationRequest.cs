using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest
    {
        public string AccountNumber { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public DomainModels.TypedPhone PrimaryPhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public DomainModels.TypedPhone SecondaryPhone { get; set; }

        [Required]
        public DomainModels.Address BillingAddress { get; set; }
    }
}