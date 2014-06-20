using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class TypedPhone : Phone
    {
        [Required(ErrorMessage = "Category Required")]
        public PhoneCategory? Category { get; set; }
    }
}
