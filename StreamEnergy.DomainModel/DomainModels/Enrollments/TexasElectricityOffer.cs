﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class TexasElectricityOffer : IOffer
    {
        public const string Qualifier = "TexasElectricity";

        public string Id { get; set; }

        // A value from Stream Connect that, as of yet, has no value to us other than passing it back in.
        public string Provider { get; set; }

        public string OfferType
        {
            get { return TexasElectricityOffer.Qualifier; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            return container.Resolve<TexasElectricityOfferOptionPolicy>();
        }


        public string Name { get; set; }

        public string Description { get; set; }
        
        public RateType RateType { get; set; }
        public decimal Rate { get; set; }
        public decimal CancellationFee { get; set; }
        public int TermMonths { get; set; }

        public Dictionary<string, Uri> Documents { get; set; }

    }
}
