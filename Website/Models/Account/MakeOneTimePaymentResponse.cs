using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeOneTimePaymentResponse
    {
        public IEnumerable<TranslatedValidationResult> Validations { get; set; }

        public string BlockingAlertType { get; set; }

        public PaymentConfirmation Confirmation { get; set; }
    }
}