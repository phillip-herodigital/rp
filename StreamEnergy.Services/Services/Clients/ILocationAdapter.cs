using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.Services.Clients
{
    interface ILocationAdapter
    {
        bool IsFor(IEnumerable<IServiceCapability> capabilities);
        bool IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer);
        bool IsFor(Address serviceAddress, string productType);
        bool IsFor(DomainModels.Accounts.ISubAccount subAccount);
        bool NeedProvider(Location location);

        string GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities);
        string GetSystemOfRecord(IEnumerable<IServiceCapability> capabilities);
        string GetCommodityType();
        Newtonsoft.Json.Linq.JObject GetProvider(IOffer offer);
        string GetProvider(DomainModels.Accounts.ISubAccount subAccount);

        LocationOfferSet LoadOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse);

        bool SkipPremiseVerification(Location location);

        dynamic ToEnrollmentAccount(Guid globalCustomerId, UserContext context, LocationServices service, SelectedOffer offer, Newtonsoft.Json.Linq.JObject salesInfo, Guid? enrollmentAccountId = null, object depositObject = null);

        DomainModels.Accounts.ISubAccount BuildSubAccount(Address serviceAddress, dynamic details);




        string GetProductId(DomainModels.Accounts.ISubAccount subAccount);

        string GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount);
    }
}
