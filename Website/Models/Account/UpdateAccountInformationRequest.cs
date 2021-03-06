﻿using StreamEnergy.DomainModels;
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

        [Required(ErrorMessage = "Primary Phone Required")]
        [EnumerableRequired(ErrorMessage = "Phone Required")]
        [MinLength(1, ErrorMessage = "Primary Phone Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Phone ")]
        public TypedPhone[] Phone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public Email Email { get; set; }

        [Required]
        public Address BillingAddress { get; set; }

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