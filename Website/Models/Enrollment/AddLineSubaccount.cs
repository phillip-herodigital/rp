using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class AddLineSubaccount
    {
        public string Name { get; set; }
        public double Cost { get; set; }
        public string PlanID { get; set; } 
        public double? DataAvailable { get; set; }
    }
}