using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class Name : ISanitizable
    {
        [Required(ErrorMessage = "First Name Required")]
        public string First { get; set; }
        [Required(ErrorMessage = "Last Name Required")]
        public string Last { get; set; }

        void ISanitizable.Sanitize()
        {
            if (First != null)
                First = First.Trim();
            if (Last != null)
                Last = Last.Trim();
        }
    }
}
