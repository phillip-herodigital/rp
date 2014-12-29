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
        public string StartingPrice { get; set; }
        public string Header { get; set; }
        public string IndividualPlans { get; set; }
        public string GroupPlans { get; set; }
    }
}