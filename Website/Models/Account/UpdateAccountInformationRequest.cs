using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest: ISanitizable
    {
        public string AccountNumber { get; set; }

        [RegularExpression(@"^\D?([2-9]\d{2})\D?\D?(\d{3})\D?(\d{4})$", ErrorMessage = "Phone Number Invalid")]
        public string MobilePhone { get; set; }

        [RegularExpression(@"^\D?([2-9]\d{2})\D?\D?(\d{3})\D?(\d{4})$", ErrorMessage = "Phone Number Invalid")]
        public string HomePhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public DomainModels.Email Email { get; set; }

        [Required]
        public DomainModels.Address BillingAddress { get; set; }

        public bool DisablePrintedInvoices { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Email != null)
                ((ISanitizable)Email).Sanitize();
            if (BillingAddress != null)
                ((ISanitizable)BillingAddress).Sanitize();
        }
    }
}