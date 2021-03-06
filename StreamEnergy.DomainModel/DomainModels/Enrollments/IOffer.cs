﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOffer
    {
        string Id { get; }
        string OfferType { get; }

        string Name { get; }
        string Description { get; }

        IOfferOptionPolicy GetOfferOptionPolicy(Microsoft.Practices.Unity.IUnityContainer container);
    }
}
