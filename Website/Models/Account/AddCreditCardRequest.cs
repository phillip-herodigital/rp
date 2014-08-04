using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AddCreditCardRequest
    {
        [Required]
        public string Nickname { get; set; }

        [Required]
        [ValidateObject]
        public DomainModels.Payments.TokenizedCard Card { get; set; }

    }
}