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

        [ValidateObject(ErrorMessagePrefix = "")]
        public Name ContactName { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Phone ContactPhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Email ContactEmail { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Address ContactAddress { get; set; }

        [Required(ErrorMessage = "Reason Required")]
        [StringLength(50, MinimumLength = 1)]
        public string Reason { get; set; }

        [Required(ErrorMessage = "Comment Required")]
        [StringLength(1000, MinimumLength = 1)]
        public string Comment { get; set; }
    }
}