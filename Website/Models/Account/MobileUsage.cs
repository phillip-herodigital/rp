using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class MobileUsage
    {
        public string Name { get; set; }
        public string Number { get; set; }
        public string Id { get; set; }
        public decimal DataUsage { get; set; }
        public decimal MessagesUsage { get; set; }
        public decimal MinutesUsage { get; set; }
    }
}