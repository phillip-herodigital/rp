using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;
using System.ComponentModel.DataAnnotations;


namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountForOneTimeRenewalRequest
    {
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        [RegularExpression("^[0-9]{4}$")]
        public string Last4 { get; set; }
    }
}