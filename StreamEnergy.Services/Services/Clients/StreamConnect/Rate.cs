﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    public class Rate
    {
        public string Type { get; set; }
        public string Unit { get; set; }
        public string EnergyType { get; set; }
        public decimal Value { get; set; }
    }
}
