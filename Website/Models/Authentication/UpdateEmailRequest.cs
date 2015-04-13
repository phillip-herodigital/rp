using ResponsivePath.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class UpdateEmailRequest: ISanitizable
    {
        [Required]
        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public DomainModels.Email Email { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Email != null)
                ((ISanitizable)Email).Sanitize();
        }
    }
}