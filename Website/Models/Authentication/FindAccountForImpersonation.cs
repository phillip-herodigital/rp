using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.MyStream.Models.Authentication
{
    public class FindAccountForImpersonation
    {
        public DomainModels.Name CustomerName { get; set; }

        public Phone[] Phone { get; set; }
        public Email Email { get; set; }
        public Address BillingAddress { get; set; }
        public string CustomerType { get; set; }
        public string AccountNumber { get; set; }
        public decimal Balance { get; set; }
        public string Ssn { get; set; }
        public bool IsError { get; set; }
        public bool HasAccess { get; set; }
        public string ImpersonateUrl { get; set; }
    }
}