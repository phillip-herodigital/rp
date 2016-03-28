﻿using StreamEnergy.DomainModels;
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
        public Order OrderNumber{ get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public ServiceCategory ServiceCategory { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public IMEI IMEINumber { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public ReturnReason ReturnReason { get; set; }

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