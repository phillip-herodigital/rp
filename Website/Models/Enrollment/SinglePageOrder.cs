﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class SinglePageOrder
    {
        public DomainModels.CustomerContact ContactInfo { get; set; }

        public DomainModels.DriversLicense DriversLicense { get; set; }

        public string Language { get; set; }

        public DomainModels.Name SecondaryContactInfo { get; set; }

        public string SocialSecurityNumber { get; set; }

        public IEnumerable<CartEntry> Cart { get; set; }

        public OnlineAccount OnlineAccount { get; set; }

        public Address MailingAddress { get; set; }

        public Address PreviousAddress { get; set; }

        public string ContactTitle { get; set; }

        public string TaxId { get; set; }

        public string CompanyName { get; set; }

        public string DoingBusinessAs { get; set; }

        public string PreferredSalesExecutive { get; set; }

        public string PreviousProvider { get; set; }

        public string AssociateName { get; set; }

        public Guid TrustEvSessionId { get; set; }

        public DomainModels.Payments.IPaymentInfo PaymentInfo { get; set; }

        public bool AgreeToTerms { get; set; }
        
        public Dictionary<DomainModels.Enrollments.AdditionalAuthorization, bool> AdditionalAuthorizations { get; set; }

        public IEnumerable<DepositWaiver> DepositWaivers { get; set; }

        public IEnumerable<DepositAlternative> DepositAlternatives { get; set; }

        public W9BusinessData W9BusinessData { get; set; }
    }
}