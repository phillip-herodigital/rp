using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class AccountInformation
    {
        public Dictionary<string, Location> Locations { get; set; }

        public DomainModels.CustomerContact ContactInfo { get; set; }

        public DomainModels.Address BillingAddress { get; set; }

        public DomainModels.DriversLicense DriversLicense { get; set; }

        public string Language { get; set; }

        public DomainModels.Name SecondaryContactInfo { get; set; }

        public string SocialSecurityNumber { get; set; }

        public Dictionary<string, Dictionary<string, DomainModels.Enrollments.IOfferOption>> OfferOptions { get; set; }
    }
}