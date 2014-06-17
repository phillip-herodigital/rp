using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetAccountInformationResponse
    {
        public DomainModels.CustomerContact CustomerContact { get; set; }
        public DomainModels.Address CustomerAddress { get; set; }
    }
}