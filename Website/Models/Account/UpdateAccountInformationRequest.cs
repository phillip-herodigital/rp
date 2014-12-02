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
        public DomainModels.Phone MobilePhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public DomainModels.Phone HomePhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public DomainModels.Email Email { get; set; }

        [Required]
        public DomainModels.Address BillingAddress { get; set; }

        public bool DisablePrintedInvoices { get; set; }
    }
}