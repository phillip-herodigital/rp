﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class DepositOfferPaymentAmount : IOfferPaymentAmount
    {
        public const string Qualifier = "Deposit";

        public string OfferPaymentAmountType
        {
            get { return Qualifier; }
        }

        public decimal DollarAmount { get; set; }

        public bool IsDollarAmountEstimated
        {
            get { return false; }
        }

    }
}