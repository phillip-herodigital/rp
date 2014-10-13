using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AddBankAccountRequest
    {
        [Required]
        public string Nickname { get; set; }

        [Required]
        [ValidateObject]
        public DomainModels.Payments.TokenizedBank BankAccount { get; set; }

        public string Description { get; set; }
    }
}