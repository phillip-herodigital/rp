﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class UserContext : ISanitizable
    {
        public bool IsRenewal { get; set; }

        [Required(ErrorMessage = "Contact Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        [Required(ErrorMessage = "Services Required")]
        [EnumerableRequired(ErrorMessage = "Services Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Service ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage = "Services Required")]
        public LocationServices[] Services { get; set; }


        [ValidateObject(ErrorMessagePrefix = "Secondary Contact ")]
        public Name SecondaryContactInfo { get; set; }

        [RegularExpression(@"^\d{3}\D*\d{2}\D*\d{4}$", ErrorMessage = "Social Security Number Invalid")]
        public string SocialSecurityNumber { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Drivers License ")]
        public DriversLicense DriversLicense { get; set; }
        /// <summary>
        /// ISO 639-1 codes, such as "en" and "es".
        /// </summary>
        public string Language { get; set; }

        [Required(ErrorMessage = "Selected Identity Answers Required")]
        public Dictionary<string, string> SelectedIdentityAnswers { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public DomainModels.Payments.IPaymentInfo PaymentInfo { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

        [ValidateObject]
        public OnlineAccount OnlineAccount { get; set; }

        void ISanitizable.Sanitize()
        {
            if (SocialSecurityNumber != null)
                SocialSecurityNumber = System.Text.RegularExpressions.Regex.Replace(SocialSecurityNumber, "[^0-9]", "");
            if (Language != null)
                Language = Language.Trim();

            if (ContactInfo != null)
                ((ISanitizable)ContactInfo).Sanitize();
            if (SecondaryContactInfo != null)
                ((ISanitizable)SecondaryContactInfo).Sanitize();
            if (DriversLicense != null)
                ((ISanitizable)DriversLicense).Sanitize();
            if (OnlineAccount != null)
                ((ISanitizable)OnlineAccount).Sanitize();
        }

    }
}
