using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Enrollments.Service
{
    [Serializable]
    public class PlaceOrderResult
    {
        public bool IsSuccess { get; set; }
        public string ConfirmationNumber { get; set; }
        public Payments.PaymentResult PaymentConfirmation { get; set; }
    }
}
