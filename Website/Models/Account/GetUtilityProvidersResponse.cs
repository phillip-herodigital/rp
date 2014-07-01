using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace StreamEnergy.MyStream.Models.Account
{
    public class GetUtilityProvidersResponse
    {
        public IEnumerable<string> Providers { get; set; }
    }
}