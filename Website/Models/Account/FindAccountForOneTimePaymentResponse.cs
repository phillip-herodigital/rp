using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class FindAccountForOneTimePaymentResponse
    {
        public bool Success { get; set; }
        public AccountToPay Account { get; set; }
    }
}