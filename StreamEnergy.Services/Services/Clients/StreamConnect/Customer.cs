using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.StreamConnect
{
    class Customer
    {
        public Guid GlobalCustomerId { get; set; }
        public string PortalId { get; set; }
        public string EmailAddress { get; set; }
        public string UserName { get; set; }
    }
}
