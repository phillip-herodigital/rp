using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts.ResetPassword
{
    [Serializable]
    public class ResetPasswordContext : ISanitizable
    {
        [Required]
        public string Username { get; set; }

        public Dictionary<Guid, string> ChallengeQuestions { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Username != null)
                Username = Username.Trim();
        }
    }
}
