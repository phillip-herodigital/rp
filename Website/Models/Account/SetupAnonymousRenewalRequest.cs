using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class SetupAnonymousRenewalRequest
    {
        public string AccountNumber { get; set; }

        public string SubAccountId { get; set; }
    }
}