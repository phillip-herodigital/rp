using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AccountPayment
    {
        [Required]
        [ValidateObject]
        public DomainModels.Payments.IPaymentInfo PaymentAccount { get; set; }
        [Required]
        public string AccountNumber { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal PaymentAmount { get; set; }
        [RegularExpression("^[0-9]{3}$")]
        public string SecurityCode { get; set; }
    }
}
