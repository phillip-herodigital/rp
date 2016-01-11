using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountForOneTimeRenewalResponse
    {
        public bool Success { get; set; }
        public bool IsCommercial { get; set; }
        public bool AvailableForRenewal { get; set; }
        public bool TexasOrGeorgia { get; set; }
        public string State { get; set; }
    }
}