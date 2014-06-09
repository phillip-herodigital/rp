using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels
{
    [Serializable]
    [System.Web.Mvc.ModelBinder(typeof(Mvc.IgnoreBlanksModelBinder))]
    public class DriversLicense : ISanitizable
    {
        [Required(ErrorMessage="Number Required")]
        public string Number { get; set; }

        [Required(ErrorMessage = "State Required")]
        [RegularExpression("^[A-Z]{2}$", ErrorMessage = "State Invalid")]
        public string StateAbbreviation { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Number != null)
                Number = Number.Trim();
        }
    }
}
