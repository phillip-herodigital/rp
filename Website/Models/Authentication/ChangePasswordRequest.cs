using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class ChangePasswordRequest
    {
        public string ResetToken { get; set; }

        [Required(ErrorMessage = "Password Required")]
        [MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password Required")]
        [Compare("Password", ErrorMessage = "Confirm Password Mismatch")]
        public string ConfirmPassword { get; set; }
    }
}