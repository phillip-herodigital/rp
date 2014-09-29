using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    interface ISitecoreProductData
    {
        SitecoreProductInfo GetTexasElectricityProductData(StreamConnect.Product product);

        SitecoreProductInfo GetGeorgiaGasProductData(StreamConnect.Product product);
    }
}
