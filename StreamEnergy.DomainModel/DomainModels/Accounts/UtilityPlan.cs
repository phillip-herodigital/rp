using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    public class UtilityPlan
    {
        public string UtilityType { get; set; }
        public string PlanType { get; set; }
        public string PlanName { get; set; }
        public string Rate { get; set; }
        public string Terms { get; set; }
        public string Fees { get; set; }
        public string PlanDetails { get; set; }
        public string PricingEffictiveDate { get; set; }
        public string MinimumUsageFee { get; set; }
        public bool IsRenewable { get; set; }
    }
}
