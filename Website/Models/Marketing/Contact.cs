using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class Contact
    {
        public bool ShowSuccessMessage { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix = "")]
        public Name ContactName { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Phone ContactPhone { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix = "")]
        public Email ContactEmail { get; set; }

        public string AddressLine1 { get; set; }

        [Required(ErrorMessage = "City Required")]
        public string City { get; set; }

        [Required(ErrorMessage = "State Required")]
        public string StateAbbreviation { get; set; }

        [Required(ErrorMessage = "Postal Code Required")]
        [RegularExpression("^[0-9]{5}$", ErrorMessage = "Postal Code Invalid")]
        public string PostalCode5 { get; set; }


        [Required(ErrorMessage = "Reason Required")]
        [StringLength(50, MinimumLength = 1)]
        public string Reason { get; set; }

        [Required(ErrorMessage = "Comment Required")]
        [StringLength(1000, MinimumLength = 1)]
        public string Comment { get; set; }
    }
}