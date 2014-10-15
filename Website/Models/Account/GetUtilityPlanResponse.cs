using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetUtilityPlanResponse
    {
        public ISubAccount[] SubAccounts { get; set; }
    }
}