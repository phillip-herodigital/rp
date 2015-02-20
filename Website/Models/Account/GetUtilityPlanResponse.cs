using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetUtilityPlanResponse
    {
        public Guid AccountId { get; set; }
        public ISubAccount[] SubAccounts { get; set; }
        public bool HasRenewalEligibiltiy { get; set; }
    }
}