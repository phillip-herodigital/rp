using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class SetAutoPayRequest
    {
        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public StreamEnergy.DomainModels.Payments.AutoPaySetting AutoPay { get; set; }

        [RegularExpression("^[0-9]{3}$")]
        public string SecurityCode { get; set; }
    }
}