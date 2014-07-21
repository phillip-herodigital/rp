using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web.Security;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class OnlineAccount : ISanitizable, IValidatableObject
    {
        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Required")]
        [MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password Required")]
        [Compare("Password", ErrorMessage = "Password Mismatch")]
        public string ConfirmPassword { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Username != null)
                Username = Username.Trim();
        }

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
