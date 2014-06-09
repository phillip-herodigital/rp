using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Web.Security;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    [Serializable]
    public class ResetPasswordContext : ISanitizable, IValidatableObject
    {
        [Required(ErrorMessage = "Domain Prefix Required")]
        public string DomainPrefix { get; set; }

        [Required(ErrorMessage = "Username Required")]
        public string Username { get; set; }


        public Dictionary<Guid, string> Answers { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Username != null)
                Username = Username.Trim();
        }

        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            if (Username != null && DomainPrefix != null)
            {
                if (Membership.GetUser(DomainPrefix + Username) == null)
                {
                    yield return new ValidationResult("Unknown Username", new[] { "Username" });
                }
            }
        }

    }
}
