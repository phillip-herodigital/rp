using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
    public class InstallmentPlanDetails
    {
        public bool IsAvailable { get; set; }

        public CreditRatingInstallmentPlan ByCreditRating { get; set; }

        public decimal Price { get; set; }
    }
}
