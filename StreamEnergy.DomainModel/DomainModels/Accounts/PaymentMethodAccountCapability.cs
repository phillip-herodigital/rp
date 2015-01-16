using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class PaymentMethodAccountCapability : IAccountCapability
    {
        public const string Qualifier = "PaymentMethod";

        public PaymentMethodAccountCapability(List<AvailablePaymentMethod> availablePaymentMethods = null)
        {
            AvailablePaymentMethods = availablePaymentMethods != null ? availablePaymentMethods : new List<AvailablePaymentMethod>();
        }

        public string CapabilityType
        {
            get { return Qualifier; }
        }

        public List<AvailablePaymentMethod> AvailablePaymentMethods { get; private set; }
    }
}
