﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    public class TexasElectricityOffer : IOffer
    {
        public const string OfferTypeQualifier = "TexasElectricity";

        public string ID { get; set; }

        public string OfferType
        {
            get { return TexasElectricityOffer.OfferTypeQualifier; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy()
        {
            return new TexasElectricityOfferOptionPolicy();
        }
    }
}
