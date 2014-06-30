using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web.Security;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    [Serializable]
    public class CreateAccountContext : ISanitizable, IValidatableObject
    {
        [Required(ErrorMessage = "Account Number Required")]
        [RegularExpression(@"^\s*\w.*$", ErrorMessage = "Account Number Invalid")]
        public string AccountNumber { get; set; }

        [Required(ErrorMessage = "Ssn Last Four Required")]
        [RegularExpression(@"^\s*[0-9]{4}\s*$", ErrorMessage = "Ssn Last Four Invalid")]
        public string SsnLastFour { get; set; }

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
            if (AccountNumber != null)
                AccountNumber = AccountNumber.Trim();

            if (SsnLastFour != null)
                SsnLastFour = SsnLastFour.Trim();

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
