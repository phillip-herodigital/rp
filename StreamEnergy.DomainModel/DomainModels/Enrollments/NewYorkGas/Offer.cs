﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;

namespace StreamEnergy.DomainModels.Enrollments.NewYorkGas
{
    [Serializable]
    public class Offer : IOffer
    {
        public const string Qualifier = "NewYorkGas";

        public string Id { get; set; }
        public string Code { get; set; }

        // A value from Stream Connect that, as of yet, has no value to us other than passing it back in.
        public string Provider { get; set; }

        public virtual string OfferType
        {
            get { return Offer.Qualifier; }
        }

        public IOfferOptionPolicy GetOfferOptionPolicy(IUnityContainer container)
        {
            switch (EnrollmentType) {
                case Enrollments.EnrollmentType.Switch:
                    return container.Resolve<SwitchOfferOptionPolicy>();
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
        public string CancellationFee { get; set; }
        public string MonthlyServiceCharge { get; set; }
        public int TermMonths { get; set; }

        public Dictionary<string, Uri> Documents { get; set; }

        public IEnumerable<KeyValuePair<string, string>> Footnotes { get; set; }

        public string Product { get; set; }
    }
}
