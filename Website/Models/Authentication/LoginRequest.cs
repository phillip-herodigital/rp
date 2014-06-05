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
        // TODO - change this domain out
        protected string Domain { get { return "sitecore"; } }
        public string Username { get; set; }
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
            if (!Membership.ValidateUser(Domain + "\\" + Username, Password))
            {
                yield return new ValidationResult("Error Text", new[] { "Username", "Password" });
            }
        }
    }
}