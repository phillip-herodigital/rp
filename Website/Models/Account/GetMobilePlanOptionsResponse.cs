using StreamEnergy.DomainModels.Enrollments.Mobile;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetMobilePlanOptionsResponse
    {
        public DateTime EffectiveDate { get; set; }
        public string CurrentPlanId { get; set; }

        public IEnumerable<Offer> DataPlans { get; set; }
    }
}