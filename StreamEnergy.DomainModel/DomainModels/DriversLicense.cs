using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    public class DriversLicense : ISanitizable
    {
        [Required]
        public string Number { get; set; }
        [Required]
        public string StateAbbreviation { get; set; }

        void ISanitizable.Sanitize()
        {
            throw new NotImplementedException();
        }
    }
}
