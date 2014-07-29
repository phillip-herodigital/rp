using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
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
                string connectionString = Sitecore.Configuration.Settings.GetConnectionString("core");

                using (var connection = new SqlConnection(connectionString))
                using (var command = new SqlCommand(@"
SELECT FailedPasswordAttemptCount
FROM [MyStreamSitecore_Core].[dbo].[aspnet_Membership]
JOIN [MyStreamSitecore_Core].[dbo].[aspnet_Users] ON [aspnet_Membership].UserId = [aspnet_Users].UserId
WHERE UserName=@username
", connection))
                {
                    connection.Open();
                    command.Parameters.Add(new SqlParameter("@username", System.Data.SqlDbType.VarChar) { Value = Domain.AccountPrefix + Username });

                    var count = Convert.ToInt32(command.ExecuteScalar());
                    if (count >= 2)
                    {
                        yield return new ValidationResult("Repeated Error Text", new[] { "Username", "Password" });
                    }
                    else
                    {
                        yield return new ValidationResult("Error Text", new[] { "Username", "Password" });
                    }
                }
            }
        }
    }
}