using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.MobileEnrollment
{
    public class MobilePhone
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public int Usage { get; set; }

        public string Name { get; set; }
        public Dictionary<string, string> Price { get; set; }
        public string ImageUrl { get; set; }
        public string Brand { get; set; }
        public string OS { get; set; }
        public string Description { get; set; }
        public Dictionary<string, string> Color { get; set; }
        public Dictionary<string, string> Size { get; set; }
    }
}