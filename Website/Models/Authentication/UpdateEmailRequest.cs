using ResponsivePath.Validation;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class UpdateEmailRequest
    {
        [Required(ErrorMessage = "Email Required")]
        [ValidateObject(ErrorMessage = "Email Invalid")]
        public DomainModels.Email Email { get; set; }
    }
}