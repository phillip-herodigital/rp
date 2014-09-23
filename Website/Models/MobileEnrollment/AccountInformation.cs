using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class AccountInformation
    {
        public DomainModels.CustomerContact ContactInfo { get; set; }

        public Address BillingAddress { get; set; }

        public Address ShippingAddress { get; set; }
    }
}