using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts.Create
{
    [Serializable]
    public class CreateAccountContext : ISanitizable
    {
        [Required(ErrorMessage = "Account Number Required")]
        [RegularExpression(@"^\s*\w.*$", ErrorMessage = "Account Number Invalid")]
        public string AccountNumber { get; set; }

        [Required(ErrorMessage = "Ssn Last Four Required")]
        [RegularExpression(@"^\s*[0-9]{4}\s*$", ErrorMessage = "Ssn Last Four Invalid")]
        public string SsnLastFour { get; set; }

        public CustomerContact Customer { get; set; }

        public Address Address { get; set; }

        public void Sanitize()
        {
            if (AccountNumber != null)
                AccountNumber = AccountNumber.Trim();

            if (SsnLastFour != null)
                SsnLastFour = SsnLastFour.Trim();
        }

    }
}
