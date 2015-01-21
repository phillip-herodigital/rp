using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    public class TransferInfo
    {
        [Required]
        public string PhoneNumber { get; set; }
        [Required]
        public string Password { get; set; }
        public string CurrentProvider { get; set; }
        [Required]
        public string Ssn { get; set; }

        public string AuthorizedBy { get; set; }

        [Required]
        public string AccountNumber { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string BusinessName { get; set; }

        public string BillingAddressStreetNumber { get; set; }

        public string BillingAddressStreetName { get; set; }

        public string BillingAddressStreetDirection { get; set; }

        public string BillingAddressCity { get; set; }

        public string BillingAddressState { get; set; }

        public string BillingAddressZip { get; set; }

        public string BillingAddressLine2 { get; set; }
    }
}
