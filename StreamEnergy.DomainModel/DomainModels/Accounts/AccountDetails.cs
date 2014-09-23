using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    public class AccountDetails
    {
        public CustomerContact ContactInfo { get; set; }

        public Address BillingAddress { get; set; }
    }
}
