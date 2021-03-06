﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using ResponsivePath.Validation;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MakeOneTimePaymentRequest
    {
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string CustomerName { get; set; }
        
        [Required]
        public Email CustomerEmail { get; set; }

        [Required]
        [ValidateObject]
        public DomainModels.Payments.IPaymentInfo PaymentAccount { get; set; }

        [Range(0.01, double.MaxValue)]
        public decimal TotalPaymentAmount { get; set; }

        [Required]
        public string[] OverrideWarnings { get; set; }
    }
}