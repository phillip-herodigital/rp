using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class Order : ISanitizable
    {
        [Required(ErrorMessage = "Order Number Required")]
        [RegularExpression(@"^\D?([0-9]\d{2})\D?$", ErrorMessage = "Number Invalid")]
        public string Number { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Number != null)
                Number = System.Text.RegularExpressions.Regex.Replace(Number, "[^0-9]", "");
        }
    }
}
