﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOfferOptionPolicy
    {
        bool AcceptsOptions(IOfferOption offerOption);

        IOfferOptionRules GetOptionRules(Location location, IOffer offer);
    }
}
