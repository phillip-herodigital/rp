using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels
{
    /// <summary>
    /// Information used to contact the customer
    /// </summary>
    [Serializable]
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class CustomerContact : ISanitizable
    {
        [Required(ErrorMessage = "Name Required")]
        [ValidateObject]
        public Name Name { get; set; }

        [Required(ErrorMessage = "Primary Phone Required")]
        [EnumerableRequired(ErrorMessage = "Phone Required")]
        [MinLength(1, ErrorMessage = "Primary Phone Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Phone ")]
        public Phone[] Phone { get; set; }

        [Required(ErrorMessage = "Email Required")]
        [ValidateObject(ErrorMessagePrefix = "Email ")]
        public Email Email { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Name != null)
                ((ISanitizable)Name).Sanitize();

            if (Phone != null)
            {
                Phone = Phone.Where(p => p != null).ToArray();
                foreach (var entry in Phone)
                {
                    ((ISanitizable)entry).Sanitize();
                }
            }

            if (Email != null)
                ((ISanitizable)Email).Sanitize();
        }
    }
}
