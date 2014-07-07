using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    public struct AzureAcsConfiguration
    {
        public Uri Url { get; set; }
        public string Realm { get; set; }
        public string IdentityName { get; set; }
        public string IdentityKey { get; set; }
    }
}
