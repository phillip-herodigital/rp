using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class Product
    {
        public string Description { get; set; }
        public IEnumerable<Fee> Fees { get; set; }
        public string Name { get; set; }
        public string ProductCode { get; set; }
        public string ProductType { get; set; }
        public Newtonsoft.Json.Linq.JToken Provider { get; set; }
        public Rate Rate { get; set; }
        public string SystemOfRecord { get; set; }
        public int Term { get; set; }
    }
}
