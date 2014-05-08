using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    public class Address : ISanitizable
    {
        [Required(ErrorMessage = "Address Line 1 Required")]
        public string AddressLine1 { get; set; }

        public string AddressLine2 { get; set; }
        public string UnitNumber { get; set; }

        [Required(ErrorMessage = "City Required")]
        public string City { get; set; }
        
        [Required(ErrorMessage = "State Required")]
        public string StateAbbreviation { get; set; }
        
        [Required(ErrorMessage = "Postal Code Required")]
        public string PostalCode5 { get; set; }

        public string PostalCodePlus4 { get; set; }

        void ISanitizable.Sanitize()
        {
            if (AddressLine1 != null)
                AddressLine1 = AddressLine1.Trim();

            if (AddressLine2 != null) 
                AddressLine2 = AddressLine2.Trim();

            if (UnitNumber != null) 
                UnitNumber = UnitNumber.Trim();

            if (City != null) 
                City = City.Trim();

            if (StateAbbreviation != null) 
                StateAbbreviation = StateAbbreviation.Trim();

            if (PostalCode5 != null) 
                PostalCode5 = PostalCode5.Trim();

            if (PostalCodePlus4 != null) 
                PostalCodePlus4 = PostalCodePlus4.Trim();
        }
    }
}
