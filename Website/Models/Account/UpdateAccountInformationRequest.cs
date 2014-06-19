using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class UpdateAccountInformationRequest
    {
        public string AccountId { get; set; }
        public DomainModels.Name CustomerName { get; set; }
        public DomainModels.Phone PrimaryPhone { get; set; }
        public DomainModels.Phone SecondaryPhone { get; set; }
        public DomainModels.Address CustomerAddress { get; set; }
    }
}