using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    public class InstallmentPlanDetails
    {
        public bool IsInstallmentPlanAvailable { get; set; }

        public CreditRatingInstallmentPlan ByCreditRating { get; set; }
    }
}
