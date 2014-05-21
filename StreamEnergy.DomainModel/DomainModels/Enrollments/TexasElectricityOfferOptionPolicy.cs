﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    class TexasElectricityOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public TexasElectricityOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is TexasElectricityOfferOption;
        }

        public IOfferOptionRules GetOptionRules(Address serviceAddress, IOffer offer, IEnumerable<IServiceCapability> serviceCapabilities)
        {
            return new TexasOfferOptionRules
            {
                ConnectDates = enrollmentService.LoadConnectDates(serviceAddress, serviceCapabilities)
            };
        }
    }
}
