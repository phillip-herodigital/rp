using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Payments
{
    public class AutoPaySetting
    {
        public bool IsEnabled { get; set; }
        public Guid? PaymentMethodId { get; set; }
    }
}
