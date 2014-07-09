﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class PaymentMethodAccountCapability : IAccountCapability
    {
        public const string Qualifier = "PaymentMethod";

        public PaymentMethodAccountCapability()
        {
            AvailablePaymentMethods = new List<AvailablePaymentMethod>();
        }

        public string CapabilityType
        {
            get { return Qualifier; }
        }

        public List<AvailablePaymentMethod> AvailablePaymentMethods { get; private set; }
    }
}
