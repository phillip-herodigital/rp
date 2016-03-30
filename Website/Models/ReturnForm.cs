using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models
{
    public class ReturnForm : ISanitizable
    {
        public bool ShowSuccessMessage { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Name ContactName { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Email ContactEmail { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public Phone ContactPhone { get; set; }

        public String OrderNumber{ get; set; }

        public String LastFour { get; set; }

        public bool EnergyServices { get; set; }

        public bool MobileServices { get; set; }

        public bool HomeServices { get; set; }

        public String IMEINumber { get; set; }

        [Required]
        public String ReturnReason { get; set; }

        public string ContactComments { get; set; }


        void ISanitizable.Sanitize()
        {
            if (ContactPhone != null)
                ((ISanitizable)ContactPhone).Sanitize();

            if (ContactEmail != null)
                ((ISanitizable)ContactEmail).Sanitize();
        }
    }
}