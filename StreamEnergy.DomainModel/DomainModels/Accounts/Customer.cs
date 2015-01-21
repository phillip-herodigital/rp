using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class Customer
    {
        public Guid GlobalCustomerId { get; set; }
        public string AspNetUserProviderKey { get; set; }
        public string Username { get; set; }
        public string EmailAddress { get; set; }
    }
}
