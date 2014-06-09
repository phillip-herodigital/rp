using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Security;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class LoginRequest : ISanitizable, IValidatableObject
    {
        public Sitecore.Security.Domains.Domain Domain { get; set; }
        
        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }

        [Required(ErrorMessage = "Password Required")]
        public string Password { get; set; }

        public bool RememberMe { get; set; }

        public void Sanitize()
        {
            Username = Username.Trim();
            Password = Password.Trim();
        }

        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            Sanitize();
            if (Domain == null)
            {
                yield return new ValidationResult("Domain Not Provided");
            }
            else if (!Membership.ValidateUser(Domain.AccountPrefix + Username, Password))
            {
                yield return new ValidationResult("Error Text", new[] { "Username", "Password" });
            }
        }
    }
}