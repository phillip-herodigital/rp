using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeMultiplePaymentsRequest
    {
        [Required]
        public AccountPayment[] Accounts { get; set; }
        public DateTime PaymentDate { get; set; }
        [Required]
        public string[] OverrideWarnings { get; set; }
    }
}