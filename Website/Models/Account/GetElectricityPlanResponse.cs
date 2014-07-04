using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetElectricityPlanResponse
    {
        public UtilityPlan ElectricityPlan { get; set; }
    }
}