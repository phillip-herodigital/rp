﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments
{
    public interface IOfferOption : ISanitizable
    {
        string OptionType { get; }
        string PreviousProvider { get; set; }
    }
}
