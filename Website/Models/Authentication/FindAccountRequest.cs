using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class FindAccountRequest
    {
        public string AccountNumber { get; set; }
        public string SsnLastFour { get; set; }
    }
}