using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class Email : ISanitizable
    {
        [Required(ErrorMessage = "Address Required")]
        [EmailAddress(ErrorMessage = "Address Invalid")]
        public string Address { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Address != null)
                Address = Address.Trim().ToLower();
        }
    }
}
