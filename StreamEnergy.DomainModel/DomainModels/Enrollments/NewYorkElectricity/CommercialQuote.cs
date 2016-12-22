﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkElectricity
{
    [Serializable]
    public class CommercialQuote : IOffer
    {
        public const string Qualifier = "NewYorkElectricityCommercialQuote";
        
        public string Id
        {
            get { return Qualifier; }
        }

        public string OfferType
        {
            get { return Qualifier; }
        }

        public string Name
        {
            get { return ""; }
        }

        public string Description
        {
            get { return ""; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<CommercialQuoteOptionPolicy>();
        }
    }
}
