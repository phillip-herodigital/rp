using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeMultiplePaymentsResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        /// <summary>
        /// String flag that indicates an alert has blocked the payment
        /// </summary>
        public string BlockingAlertType { get; set; }

        public PaymentConfirmation[] Confirmations { get; set; }
    }
}