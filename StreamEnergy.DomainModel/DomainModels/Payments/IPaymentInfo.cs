using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.DomainModels.Payments
{
    public interface IPaymentInfo
    {
        string PaymentType { get; }
    }
}
