using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class Phone : ISanitizable
    {
        [Required(ErrorMessage = "Number Required")]
        [RegularExpression(@"^\D?([2-9]\d{2})\D?\D?(\d{3})\D?(\d{4})$", ErrorMessage = "Number Invalid")]
        public string Number { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Number != null)
                Number = System.Text.RegularExpressions.Regex.Replace(Number, "[^0-9]", "");
        }
    }
}
