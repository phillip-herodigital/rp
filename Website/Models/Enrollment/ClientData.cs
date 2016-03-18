using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Associate;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ClientData
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public ExpectedState ExpectedState { get; set; }

        public IEnumerable<CartEntry> Cart { get; set; }

        // Personal information
        public CustomerContact ContactInfo { get; set; }
        public Name SecondaryContactInfo { get; set; }
        public DriversLicense DriversLicense { get; set; }
        public string Language { get; set; }

        // Identity verification
        public DomainModels.Enrollments.IdentityQuestion[] IdentityQuestions { get; set; }
        public Dictionary<string, string> SelectedIdentityAnswers { get; set; }

        public bool IsRenewal { get; set; }

        public bool IsSinglePage { get; set; }

        public Guid LoggedInCustomerId { get; set; }

        public bool EnrolledInAutoPay { get; set; }

        public string NewAccountUserName { get; set; }

        public IEnumerable<DomainModels.Enrollments.UserAccountDetails> LoggedInAccountDetails { get; set; }

        public bool IsLoading { get; set; }

        public bool IsTimeout { get; set; }

        public bool NeedsRefresh { get; set; }

        public Address MailingAddress { get; set; }

        public Address PreviousAddress { get; set; }

        public string PreviousProvider { get; set; }

        public string ProvisionedTelephoneNumber { get; set; }

        public AssociateInformation AssociateInformation { get; set; }

        public string AssociateName { get; set; }

        public bool AssociateEmailSent { get; set; }

        public bool EnrollmentScreenshotTaken { get; set; }
    }
}