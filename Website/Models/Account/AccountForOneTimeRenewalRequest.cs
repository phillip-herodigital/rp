using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountForOneTimeRenewalRequest
    {
        public string AccountNumber { get; set; }
        public string Last4 { get; set; }
    }
}