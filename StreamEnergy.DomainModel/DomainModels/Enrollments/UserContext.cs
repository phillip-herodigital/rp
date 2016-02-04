﻿using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels.Associate;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class UserContext : ISanitizable, IValidatableObject
    {
        public bool IsRenewal { get; set; }

        public bool IsSinglePage { get; set; }

        public bool NeedsRefresh { get; set; }

        [Required(ErrorMessage = "Contact Info Required")]
        [ValidateObject(ErrorMessagePrefix = "")]
        public CustomerContact ContactInfo { get; set; }

        public string ContactTitle { get; set; }

        [Required(ErrorMessage = "Services Required")]
        [EnumerableRequired(ErrorMessage = "Services Required")]
        [ValidateEnumerable(ErrorMessagePrefix = "Service ")]
        [CollectionCountRangeAttribute(1, int.MaxValue, ErrorMessage = "Services Required")]
        public LocationServices[] Services { get; set; }


        [ValidateObject(ErrorMessagePrefix = "Secondary Contact ")]
        public Name SecondaryContactInfo { get; set; }

        [RegularExpression(@"^\d{3}\D*\d{2}\D*\d{4}$", ErrorMessage = "Social Security Number Invalid")]
        public string SocialSecurityNumber { get; set; }

        [RegularExpression(@"^\d{2}\D*\d{7}$", ErrorMessage = "Tax Id Invalid")]
        public string TaxId { get; set; }

        public string CompanyName { get; set; }

        [DisplayName("DBA")]
        public string DoingBusinessAs { get; set; }

        public string PreviousProvider { get; set; }

        public string PreferredSalesExecutive { get; set; }

        /// <summary>
        /// ISO 639-1 codes, such as "en" and "es".
        /// </summary>
        public string Language { get; set; }

        public string SitecoreLanguageIsoCode { get; set; }

        [Required(ErrorMessage = "Selected Identity Answers Required")]
        public Dictionary<string, string> SelectedIdentityAnswers { get; set; }

        [ValidateObject(ErrorMessagePrefix = "")]
        public DomainModels.Payments.IPaymentInfo PaymentInfo { get; set; }

        [Required(ErrorMessage = "Authorizations Required")]
        public Dictionary<AdditionalAuthorization, bool> AdditionalAuthorizations { get; set; }

        [ValidateObject(ErrorMessagePrefix = "Business ")]
        public W9BusinessData W9BusinessData { get; set; }

        [RequireValue(true, ErrorMessage = "Must Agree To Terms")]
        public bool AgreeToTerms { get; set; }

        [ValidateObject]
        public OnlineAccount OnlineAccount { get; set; }
        
        [Required(ErrorMessage = "Mailing Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Mailing Address ")]
        public Address MailingAddress { get; set; }

        [Required(ErrorMessage = "Previous Address Required")]
        [ValidateObject(ErrorMessagePrefix = "Previous Address ")]
        public Address PreviousAddress { get; set; }

        public string AssociateName { get; set; }

        public string TrustEvCaseId { get; set; }

        public Guid TrustEvSessionId { get; set; }

        void ISanitizable.Sanitize()
        {
            if (SocialSecurityNumber != null)
                SocialSecurityNumber = System.Text.RegularExpressions.Regex.Replace(SocialSecurityNumber, "[^0-9]", "");
            if (TaxId != null)
                TaxId = System.Text.RegularExpressions.Regex.Replace(TaxId, "[^0-9]", "");
            if (Language != null)
                Language = Language.Trim();

            if (ContactInfo != null)
                ((ISanitizable)ContactInfo).Sanitize();
            if (SecondaryContactInfo != null)
                ((ISanitizable)SecondaryContactInfo).Sanitize();
            if (OnlineAccount != null)
                ((ISanitizable)OnlineAccount).Sanitize();
            if (MailingAddress != null)
                ((ISanitizable)MailingAddress).Sanitize();
            if (PreviousAddress != null)
                ((ISanitizable)PreviousAddress).Sanitize();
            if (AssociateName != null)
                AssociateName = AssociateName.Trim();

        }

        IEnumerable<ValidationResult> IValidatableObject.Validate(ValidationContext validationContext)
        {
            if (SocialSecurityNumber == null && TaxId == null)
            {
                yield return new ValidationResult("Tax Id or SSN Required", new[] { "SocialSecurityNumber", "TaxId" });
            }
        }
    }
}
