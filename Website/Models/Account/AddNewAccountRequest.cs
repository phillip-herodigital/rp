using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AddNewAccountRequest : ISanitizable
    {
        [Required(ErrorMessage = "Account Number Required")]
        public string AccountNumber { get; set; }

        [Required(ErrorMessage = "Ssn Last Four Required")]
        [RegularExpression(@"^\s*[0-9]{4}\s*$", ErrorMessage = "Ssn Last Four Invalid")]
        public string SsnLast4 { get; set; }

        public string AccountNickname { get; set; }

        public void Sanitize()
        {
            if (AccountNumber != null)
                AccountNumber = AccountNumber.Trim();

            if (SsnLast4 != null)
                SsnLast4 = SsnLast4.Trim();

            if (AccountNickname != null)
                AccountNickname = AccountNickname.Trim();
        }
    }
}