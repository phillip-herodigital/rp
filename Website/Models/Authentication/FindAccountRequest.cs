using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class FindAccountRequest : ISanitizable
    {
        [Required(ErrorMessage = "Account Number Required")]
        [RegularExpression(@"\w", ErrorMessage = "Account Number Invalid")]
        public string AccountNumber { get; set; }
        
        [Required(ErrorMessage = "Ssn Last Four Required")]
        [RegularExpression(@"^\s*[0-9]{4}\s*$", ErrorMessage = "Ssn Last Four Invalid")]
        public string SsnLastFour { get; set; }

        public void Sanitize()
        {
            AccountNumber = AccountNumber.Trim();
            SsnLastFour = SsnLastFour.Trim();
        }
    }
}