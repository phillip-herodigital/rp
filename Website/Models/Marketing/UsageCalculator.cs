using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class UsageCalculator
    {

        public bool ShowBillScrape { get; set; }

        public bool ShowManualCalculator { get; set; }

        public bool IsModal { get; set; }

        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Required")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Security Question Answer Required")]
        public string SecurityQuestionAnswer { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

    }
}