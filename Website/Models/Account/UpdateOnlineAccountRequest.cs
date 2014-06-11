using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;
using StreamEnergy.MyStream.Models.Authentication;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateOnlineAccountRequest
    {
        public string Username { get; set; }
        public DomainModels.Email Email { get; set; }

        [MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }
            
        [Compare("Password", ErrorMessage = "Confirm Password Mismatch")]
        public string ConfirmPassword { get; set; }

        public IEnumerable<AnsweredSecurityQuestion> Challenges { get; set; }
        public string LanguagePreference { get; set; }

    }
}