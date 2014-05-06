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
        public CustomerName Name { get; set; }

        public string PrimaryPhone { get; set; }
        public string HomePhone { get; set; }
        public string CellPhone { get; set; }
        public string WorkPhone { get; set; }

        public string EmailAddress { get; set; }

        void ISanitizable.Sanitize()
        {
            if (Name != null)
                ((ISanitizable)Name).Sanitize();

            if (PrimaryPhone != null)
                PrimaryPhone = System.Text.RegularExpressions.Regex.Replace(PrimaryPhone, "[^0-9]", "");
            if (HomePhone != null)
                HomePhone = System.Text.RegularExpressions.Regex.Replace(HomePhone, "[^0-9]", "");
            if (CellPhone != null) 
                CellPhone = System.Text.RegularExpressions.Regex.Replace(CellPhone, "[^0-9]", "");
            if (WorkPhone != null) 
                WorkPhone = System.Text.RegularExpressions.Regex.Replace(WorkPhone, "[^0-9]", "");

            if (EmailAddress != null)
                EmailAddress = EmailAddress.Trim();
        }
    }
}
