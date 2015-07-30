﻿using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class ConfirmOrder
    {
        public DomainModels.Payments.IPaymentInfo PaymentInfo { get; set; }
        public bool AgreeToTerms { get; set; }
        public Dictionary<DomainModels.Enrollments.AdditionalAuthorization, bool> AdditionalAuthorizations { get; set; }
        public IEnumerable<DepositWaiver> DepositWaivers { get; set; }
        public IEnumerable<DepositAlternative> DepositAlternatives { get; set; }
        public W9BusinessData W9BusinessData { get; set; }
    }
}