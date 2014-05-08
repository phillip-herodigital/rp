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
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string PrimaryPhone { get; set; }
        public string WorkPhone { get; set; }
        public string CellPhone { get; set; }
        public string EmailAddress { get; set; }
        public Address BillingAddress { get; set; }
    }
}
