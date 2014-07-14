﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeMultiplePaymentsRequest
    {
        [Required]
        [ValidateObject]
        public DomainModels.Payments.IPaymentInfo PaymentAccount { get; set; }
        [Required]
        [MinLength(1)]
        public string[] AccountNumbers { get; set; }
        [Range(0.01, double.MaxValue)]
        public decimal TotalPaymentAmount { get; set; }
        public DateTime PaymentDate { get; set; }
        [Required]
        public string[] OverrideWarnings { get; set; }
    }
}