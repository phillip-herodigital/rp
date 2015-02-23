using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public class MobileModel
    {
        public string Size { get; set; }
        public string Color { get; set; }
        public string Network { get; set; }
        public string Condition { get; set; }
        public string Price { get; set; }
        public string Lease20 { get; set; }
        public string Lease24 { get; set; }
        public string Sku { get; set; }
        public bool Lte { get; set; }
    }
}