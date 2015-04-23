using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class SimActivation
    {
        [Required(ErrorMessage = "Activation Code Required")]
        public string ActivationCode { get; set; }

        [Required(ErrorMessage = "Last Name Required")]
        public string LastName { get; set; }
    }
}