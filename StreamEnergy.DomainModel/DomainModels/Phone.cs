using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    public class Phone : ISanitizable
    {
        [Required(ErrorMessage = "Number Required")]
        [RegularExpression("^[2-9][0-9]{9}$", ErrorMessage = "Number Invalid")]
        public string Number { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Number != null)
                Number = System.Text.RegularExpressions.Regex.Replace(Number, "[^0-9]", "");
        }
    }
}
