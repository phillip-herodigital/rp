using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ClientData
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public Dictionary<string, IEnumerable<DomainModels.Enrollments.IOffer>> Offers { get; set; }
        public Dictionary<string, Dictionary<string, DomainModels.Enrollments.IOfferOptionRules>> OfferOptionRules { get; set; }

        public Dictionary<string, DomainModels.Enrollments.LocationServices> LocationServices { get; set; }

        // Personal information
        public CustomerContact ContactInfo { get; set; }
        public Name SecondaryContactInfo { get; set; }
        public DriversLicense DriversLicense { get; set; }
        public string Language { get; set; }
        public Address BillingAddress { get; set; }

        // Identity verification
        public DomainModels.Enrollments.IdentityQuestion[] IdentityQuestions { get; set; }
        public Dictionary<string, string> SelectedIdentityAnswers { get; set; }

        public decimal? DepositAmount { get; set; }
        public string ConfirmationNumber { get; set; }
    }
}