using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public class MobileNetwork
    {
        public string Name { get; set; }
        public string Value { get; set; } 
        public string Description { get; set; }
        public string Coverage { get; set; }
        public string Device { get; set; }
    }
}