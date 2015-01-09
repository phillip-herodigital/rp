using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    public class ProductResponse
    {
        public IEnumerable<dynamic> Products { get; set; }
        public string Status { get; set; }
        public string ResponseMessage { get; set; }
    }
}
