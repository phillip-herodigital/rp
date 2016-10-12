﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.TexasElectricity
{
    [Serializable]
    public class Offer : IOffer
    {
        public const string Qualifier = "TexasElectricity";

        public string Id { get; set; }
        public string Tdu { get; set; }

        // A value from Stream Connect that, as of yet, has no value to us other than passing it back in.
        public string Provider { get; set; }

        public string OfferType
        {
            get { return Offer.Qualifier; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            switch (EnrollmentType)
            {
                case Enrollments.EnrollmentType.MoveIn:
                    return container.Resolve<MoveInOfferOptionPolicy>();
                case Enrollments.EnrollmentType.Switch:
                    return container.Resolve<OfferOptionPolicy>();
                case Enrollments.EnrollmentType.Renewal:
                    return container.Resolve<RenewalOfferOptionPolicy>();
                default: throw new NotSupportedException();
            }
        }

        public EnrollmentType EnrollmentType { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }
        
        public RateType RateType { get; set; }
        public decimal Rate { get; set; }
        public decimal StreamEnergyCharge { get; set; }
        public string MinimumUsageFee { get; set; }
        public string TduCharges { get; set; }
        public bool IncludesThermostat { get; set; }
        public bool IncludesSkydrop { get; set; }
        public bool IncludesPromo { get; set; }
        public bool IsDisabled { get; set; }
        public string ThermostatDescription { get; set; }
        public string SkydropDescription { get; set; }
        public string PromoIcon { get; set; }
        public string PromoDescription { get; set; }
        public decimal TerminationFee { get; set; }
        public int TermMonths { get; set; }

        public Dictionary<string, Uri> Documents { get; set; }

        public IEnumerable<KeyValuePair<string, string>> Footnotes { get; set; }

    }
}
