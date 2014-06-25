using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class SampleAccountType : IAccountType
    {
        public string AccountType { get; set; }
        public string Id { get; set; }
        public Address ServiceAddress { get; set; }

        public void Sanitize()
        {
        }
    }
}
