using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;
using StreamEnergy.MyStream.Models.Authentication;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateOnlineAccountRequest : IValidatableObject
    {
        public string Username { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix="Email ")]
        public DomainModels.Email Email { get; set; }

        public string CurrentPassword { get; set; }

        [MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }

        [Compare("Password", ErrorMessage = "Confirm Password Mismatch")]
        public string ConfirmPassword { get; set; }

        [ValidateEnumerable]
        public IEnumerable<AnsweredSecurityQuestion> Challenges { get; set; }

        [Required]
        public string LanguagePreference { get; set; }


        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Username != null)
            {
                if (Membership.FindUsersByName(Username).Count > 0)
                    yield return new ValidationResult("Username In Use", new[] { "Username" });
            }

            yield break;
        }


    }
}