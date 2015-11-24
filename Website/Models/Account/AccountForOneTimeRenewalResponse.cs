using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountForOneTimeRenewalResponse
    {
        public bool Success { get; set; }
        public bool AvailableForRenewal { get; set; }
        public string SubaccountID { get; set; }
    }
}