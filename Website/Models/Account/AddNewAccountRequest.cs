using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AddNewAccountRequest
    {
        [Required(ErrorMessage = "Account Number Required")]
        public string AccountNumber { get; set; }

        [Required(ErrorMessage = "Ssn Last Four Required")]
        [RegularExpression(@"^\s*[0-9]{4}\s*$", ErrorMessage = "Ssn Last Four Invalid")]
        public string SsnLastFour { get; set; }
    }
}