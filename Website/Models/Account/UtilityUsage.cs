﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UtilityUsage
    {
        public int Month { get; set; }
        public int Electric { get; set; }
        public int Gas { get; set; }
    }
}