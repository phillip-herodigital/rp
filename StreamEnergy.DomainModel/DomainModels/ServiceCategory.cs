using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    public class ServiceCategory
    {
        [Required(ErrorMessage = "Category Required")]
        public ServiceCategory? Category { get; set; }
    }
}
