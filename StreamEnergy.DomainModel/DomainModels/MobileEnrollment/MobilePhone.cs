using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.DomainModels.MobileEnrollment
{
    public class MobilePhone
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public Dictionary<string, string> Price { get; set; }
        public string ImageFront { get; set; }
        public string ImageBack { get; set; }
        public string Brand { get; set; }
        public string OS { get; set; }
        public string Description { get; set; }
        public string LongDescription { get; set; }
        public IEnumerable<MobileColor> Colors { get; set; }
        public IEnumerable<MobileModel> Models { get; set; }
    }
}