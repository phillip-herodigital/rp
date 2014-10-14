using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class AddPaymentAccountRequest
    {
        [Required]
        public string Nickname { get; set; }

        [Required]
        [ValidateObject]
        public DomainModels.Payments.IPaymentInfo PaymentAccount { get; set; }
    }
}