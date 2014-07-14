using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Legacy = StreamEnergy.DomainModels.Accounts.Legacy;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class HomeLifeServices
    {
        public string ClientId { get; set; }
        public bool HasFreeMonth { get; set; }
        public string SaleSource { get; set; }

        public Legacy.CustomerAccount CustomerAccount { get; set; }

        public string CampaignName { get; set; }
        public string RepId { get; set; }
        public Name RepName { get; set; }
        public Email RepEmail { get; set; }
    }
}