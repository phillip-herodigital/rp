using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest
    {
        public string AccountId { get; set; }

        // TODO - update these phone variables to the new phone model with phone type
        [Required]
        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public DomainModels.Phone PrimaryPhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public DomainModels.Phone SecondaryPhone { get; set; }

        [Required]
        public DomainModels.Address BillingAddress { get; set; }
    }
}