using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class SampleSubAccount : ISubAccount
    {
        public string SubAccountType { get; set; }
        public string Key { get; set; }
        public string Id { get; set; }
        public Address ServiceAddress { get; set; }
        public Enrollments.EnrollmentCustomerType CustomerType { get; set; }
        public string ProductType { get; set; }
        public void Sanitize()
        {
        }


        public IList<ISubAccountCapability> Capabilities { get; set; }
    }
}
