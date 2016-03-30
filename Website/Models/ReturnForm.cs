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

        [ValidateObject(ErrorMessagePrefix = "")]
        public String OrderNumber{ get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public String LastFour { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public bool EnergyServices { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public bool MobileServices { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public bool HomeServices { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public String IMEINumber { get; set; }

        [Required]
        [ValidateObject(ErrorMessagePrefix = "")]
        public String ReturnReason { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Please enter a comment/suggestion")]
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