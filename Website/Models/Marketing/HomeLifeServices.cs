using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Marketing
{
    public class HomeLifeServices
    {
        public string PostUrl { get; set; }
        public string ClientId { get; set; }
        public bool HasFreeMonth { get; set; }

        public CustomerAccount CustomerAccount { get; set; }

        public string CampaignName { get; set; }
        public string RepId { get; set; }
        public Name RepName { get; set; }
        public Email RepEmail { get; set; }
    }
}