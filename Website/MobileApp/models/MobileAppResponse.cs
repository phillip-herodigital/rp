
using StreamEnergy.MyStream.Models.Account;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.MobileApp.models
{
    public class MobileAppResponse
    {
        public MobileAppUser User { get; set; }

        public IEnumerable<MobileAppAccount> Accounts { get; set; }
    }

    public class MobileAppUser {
        public string Name;
        public string UserName;
    }
}