﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    public class EnrollmentAccountDetails
    {
        public DomainModels.Enrollments.Location Location { get; set; }

        public DomainModels.Enrollments.SelectedOffer Offer { get; set; }

        public Guid? EnrollmentAccountId { get; set; }

        public DomainModels.Enrollments.OfferPayment OfferPayments { get; set; }

        public string RequestUniqueKey { get; set; }
    }
}
