using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    /// <summary>
    /// Information used to contact the customer
    /// </summary>
    public class CustomerContact : ISanitizable
    {
        [Required(ErrorMessage = "Name Required")]
        [ValidateObject]
        public Name Name { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Primary Phone ")]
        public Phone PrimaryPhone { get; set; }
        [ValidateObject(ErrorMessagePrefix = "Home Phone ")]
        public Phone HomePhone { get; set; }
        [ValidateObject(ErrorMessagePrefix = "Cell Phone ")]
        public Phone CellPhone { get; set; }
        [ValidateObject(ErrorMessagePrefix = "Work Phone ")]
        public Phone WorkPhone { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public Email Email { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Name != null)
                ((ISanitizable)Name).Sanitize();

            if (PrimaryPhone != null)
                ((ISanitizable)PrimaryPhone).Sanitize();
            if (HomePhone != null)
                ((ISanitizable)HomePhone).Sanitize();
            if (CellPhone != null)
                ((ISanitizable)CellPhone).Sanitize();
            if (WorkPhone != null)
                ((ISanitizable)WorkPhone).Sanitize();

            if (Email != null)
                ((ISanitizable)Email).Sanitize();
        }
    }
}
