using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest: ISanitizable
    {
        public string AccountNumber { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public Phone MobilePhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Phone ")]
        public Phone HomePhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public Email Email { get; set; }

        [Required]
        public Address BillingAddress { get; set; }

        public bool DisablePrintedInvoices { get; set; }

        void ISanitizable.Sanitize()
        {
            if (MobilePhone != null)
                ((ISanitizable)MobilePhone).Sanitize();
            if (HomePhone != null)
                ((ISanitizable)HomePhone).Sanitize();
            if (Email != null)
                ((ISanitizable)Email).Sanitize();
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
        }
    }
}