using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class CommercialQuote : ISanitizable
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

        [Required(ErrorMessage = "Company Required")]
        [StringLength(50, MinimumLength = 1)]
        public string CompanyName { get; set; }

        void ISanitizable.Sanitize()
        {
            if (ContactPhone != null)
                ((ISanitizable)ContactPhone).Sanitize();

            if (ContactEmail != null)
                ((ISanitizable)ContactEmail).Sanitize();
        }
    }
}