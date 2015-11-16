using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class Impersonate
    {
        public string AccountNumber { get; set; }

        public string Expiry { get; set; }

        public string Token { get; set; }
    }
}