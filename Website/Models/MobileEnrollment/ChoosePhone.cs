﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class ChoosePhone
    {
        public IEnumerable<DomainModels.MobileEnrollment.MobilePhone> MobilePhones;
    }
}