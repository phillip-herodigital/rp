using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using StreamEnergy.DomainModels;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountInformationResponse
    {
        public DomainModels.Name CustomerName { get; set; }

        public string MobilePhone { get; set; }
        public string HomePhone { get; set; }
        public Email Email { get; set; }
        public IEnumerable<Address> ServiceAddresses { get; set; }
        public bool SameAsService { get; set; }
        public Address BillingAddress { get; set; }
        public bool DisablePrintedInvoices { get; set; }
    }
}