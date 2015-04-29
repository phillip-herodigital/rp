using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ResponsivePath.Validation;
using StreamEnergy.MyStream.Models.Authentication;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateOnlineAccountRequest : IValidatableObject
    {
        public string Username { get; set; }

        [ValidateObject(ErrorMessagePrefix="Email ")]
        public Email Email { get; set; }

        public string CurrentPassword { get; set; }

        [System.Web.Security.MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }

        [System.ComponentModel.DataAnnotations.Compare("Password", ErrorMessage = "Confirm Password Mismatch")]
        public string ConfirmPassword { get; set; }

        [ValidateEnumerable]
        public IEnumerable<AnsweredSecurityQuestion> Challenges { get; set; }


        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (Username != null)
            {
                if (System.Web.Security.Membership.FindUsersByName(Username).Count > 0)
                    yield return new ValidationResult("Username In Use", new[] { "Username" });
            }

            yield break;
        }


    }
}