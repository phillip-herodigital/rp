using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Mobile
{
    [Serializable]
    public class CreditRatingInstallmentPlan
    {
        public MobileInventory A { get; set; }
        public MobileInventory B { get; set; }
        public MobileInventory C { get; set; }
    }
}
