using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    interface ISitecoreProductData
    {
        SitecoreProductInfo GetTexasElectricityProductData(string productCode, string providerName);
        SitecoreProductInfo GetNewJerseyElectricityProductData(string productCode);
        SitecoreProductInfo GetNewJerseyGasProductData(string productCode);
        SitecoreProductInfo GetProtectiveProductData(string productId);
        SitecoreProductInfo GetGeorgiaGasProductData(string productCode);
        SitecoreProductInfo GetMobileProductData(string productId);
        SitecoreProductInfo GetMobileInventoryData(string inventoryId);
    }
}
