using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeOneTimeRenewalRequest
    {
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string Last4OfSocial { get; set; }
    }
}