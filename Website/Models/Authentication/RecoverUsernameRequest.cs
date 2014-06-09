using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class RecoverUsernameRequest
    {
        [Required]
        [ValidateObject]
        public DomainModels.Email Email { get; set; }
    }
}