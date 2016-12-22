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
        SitecoreProductInfo GetNewJerseyElectricityProductData(string productCode);
        SitecoreProductInfo GetNewJerseyGasProductData(string productCode);
        SitecoreProductInfo GetNewYorkElectricityProductData(string productCode);
        SitecoreProductInfo GetNewYorkGasProductData(string productCode);
        SitecoreProductInfo GetDCElectricityProductData(string productCode);
        SitecoreProductInfo GetPennsylvaniaElectricityProductData(string productCode);
        SitecoreProductInfo GetPennsylvaniaGasProductData(string productCode);
        SitecoreProductInfo GetMarylandElectricityProductData(string productCode);
        SitecoreProductInfo GetMarylandGasProductData(string productCode);
        SitecoreProductInfo GetNEProductData(string productCode, string state);
        SitecoreProductInfo GetProtectiveProductData(string productId);
        SitecoreProductInfo GetMobileProductData(string productId);
        SitecoreProductInfo GetMobileInventoryData(string inventoryId);
    }
}
