using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class ChangePlanRequest
    {
        public string AccountNumber { get; set; }
        public string OldPlanId { get; set; }
        public string NewPlanId { get; set; }
        public string NewChildPlanId { get; set; }
    }
}