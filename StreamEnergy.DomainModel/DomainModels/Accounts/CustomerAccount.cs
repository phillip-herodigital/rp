using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class CustomerAccount
    {
        public string CisAccountNumber { get; set; }
        public string CamelotAccountNumber { get; set; }
        public string Commodity { get; set; }
        public Name Name { get; set; }
        public Phone Primary { get; set; }
        public Phone Work { get; set; }
        public Phone Cell { get; set; }
        public Email Email { get; set; }
        public Address BillingAddress { get; set; }
    }
}
