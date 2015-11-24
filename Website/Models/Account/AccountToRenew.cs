using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountToRenew
    {
        public bool Success { get; set; }
        public string Last4OfSSN { get; set; }
        public bool CanMakeOneTimeRenewal { get; set; }
    }
}