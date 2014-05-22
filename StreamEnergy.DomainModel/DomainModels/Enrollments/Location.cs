using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class Location : ISanitizable
    {
        [Required(ErrorMessage = "Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Address ")]
        public Address Address { get; set; }

        [Required(ErrorMessage = "Capabilities Missing")]
        [EnumerableRequired(ErrorMessage = "Capabilities Missing")]
        [ValidateEnumerable(ErrorMessagePrefix = "Capabilities ")]
        public IEnumerable<IServiceCapability> Capabilities { get; set; }


        void ISanitizable.Sanitize()
        {
            if (Address != null)
                ((ISanitizable)Address).Sanitize();
        }
    }
}
