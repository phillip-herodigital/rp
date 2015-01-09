using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    interface ISitecoreProductData
    {
        SitecoreProductInfo GetTexasElectricityProductData(string productCode, string providerName);

        SitecoreProductInfo GetGeorgiaGasProductData(string productCode);

        SitecoreProductInfo GetMobileProductData(string productId);
        SitecoreProductInfo GetMobileInventoryData(string inventoryId);
    }
}
