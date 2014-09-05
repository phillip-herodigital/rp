using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Payments;

namespace StreamEnergy.DomainModels.Enrollments
{
    class DepositWaiver : IPaymentInfo
    {
        public const string Qualifier = "DepositWaiver";

        public string PaymentType
        {
            get { return Qualifier; }
        }
    }
}
