﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Protective
{
    [Serializable]
    public class OfferOptionRules : IOfferOptionRules
    {
        public const string Qualifier = "Protective";
      
        public string OptionRulesType
        {
            get { return Qualifier; }
        }

        public IOfferPaymentAmount[] GetPostBilledPayments(IOfferOption options)
        {
            return new IOfferPaymentAmount[0];
        }

        public virtual IOfferOption GetInitialOptions()
        {
            return null;
        }
    }
}
