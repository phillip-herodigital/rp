using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Security;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class AccountContext : ISanitizable, IValidatableObject
    {
        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Required")]
        [MembershipPassword(ErrorMessage = "Password Invalid")]
        public string Password { get; set; }

        [Required(ErrorMessage = "Confirm Password Required")]
        [Compare("Password", ErrorMessage = "Password Mismatch")]
        public string ConfirmPassword { get; set; }

        public Dictionary<Guid, string> Challenges { get; set; }

        public CustomerContact Customer { get; set; }

        public Address Address { get; set; }

        public void Sanitize()
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
