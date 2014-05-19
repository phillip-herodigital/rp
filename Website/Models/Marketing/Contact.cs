using StreamEnergy.DomainModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class Contact
    {
        public bool ShowSuccessMessage { get; set; }
        public CustomerContact ContactInfo { get; set; }
        public Address ContactAddress { get; set; }
    }
}