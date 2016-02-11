using System.Collections.Generic;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Enrollment
{
    public class GetLoggedInAccountDetails
    {
        public CustomerContact ContactInfo { get; set; }
        public Address MailingAddress { get; set; }
        public bool MailingAddressSame { get; set; }
    }
}