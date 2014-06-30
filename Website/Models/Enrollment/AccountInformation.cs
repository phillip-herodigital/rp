using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class AccountInformation
    {
        public DomainModels.CustomerContact ContactInfo { get; set; }

        public DomainModels.DriversLicense DriversLicense { get; set; }

        public string Language { get; set; }

        public DomainModels.Name SecondaryContactInfo { get; set; }

        public string SocialSecurityNumber { get; set; }

        public IEnumerable<CartEntry> Cart { get; set; }

        public OnlineAccount OnlineAccount { get; set; }
    }
}