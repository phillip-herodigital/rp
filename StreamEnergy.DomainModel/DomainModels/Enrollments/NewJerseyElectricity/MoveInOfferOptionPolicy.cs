﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.NewJerseyElectricity
{
    class MoveInOfferOptionPolicy : IOfferOptionPolicy
    {
        private readonly IEnrollmentService enrollmentService;

        public MoveInOfferOptionPolicy(IEnrollmentService enrollmentService)
        {
            this.enrollmentService = enrollmentService;
        }

        public bool AcceptsOptions(IOfferOption offerOption)
        {
            return offerOption is MoveInOfferOption;
        }

        public async Task<IOfferOptionRules> GetOptionRules(Location location, IOffer offer)
        {
            var sentDates = false;
            if (!sentDates)
            {
                sentDates = true;
                return new MoveInOfferOptionRules
                {
                    ConnectDates = await enrollmentService.LoadConnectDates(location, offer)
                };
            }
            return new MoveInOfferOptionRules
            {
                ConnectDates = null
            };
        }
    }
}
