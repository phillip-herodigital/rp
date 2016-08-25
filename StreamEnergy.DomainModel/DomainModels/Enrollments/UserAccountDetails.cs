using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments
{
    [Serializable]
    public class UserAccountDetails
    {
        public CustomerContact ContactInfo { get; set; }
        public Address MailingAddress { get; set; }
        public bool MailingAddressSame { get; set; }
    }
}
