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
        bool NeedProvider(Location location);

        string GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities);
        string GetSystemOfRecord(IEnumerable<IServiceCapability> capabilities);
        string GetCommodityType();
        Newtonsoft.Json.Linq.JObject Provider(IOffer offer);

        LocationOfferSet LoadOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse);

        bool SkipPremiseVerification(Location location);

        dynamic ToEnrollmentAccount(Guid globalCustomerId, UserContext context, LocationServices service, SelectedOffer offer, Newtonsoft.Json.Linq.JObject salesInfo, Guid? enrollmentAccountId = null, object depositObject = null);


    }
}
