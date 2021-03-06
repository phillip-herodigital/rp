﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class AccountDetails
    {
        public CustomerContact ContactInfo { get; set; }

        public Address BillingAddress { get; set; }

        public string SsnLastFour { get; set; }

        public bool? TcpaPreference { get; set; }

        public string BillingDeliveryPreference { get; set; }
    }
}
