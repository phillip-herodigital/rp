using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.DomainModels.Accounts
{
    [Serializable]
    public class MobileAccountUsage : AccountUsage
    {
        public string PhoneNumber { get; set; }
        public string InvoiceNumber { get; set; }
        public decimal DataUsage { get; set; }
        public decimal MinutesUsage { get; set; }
        public decimal MessagesUsage { get; set; }
    }
}
