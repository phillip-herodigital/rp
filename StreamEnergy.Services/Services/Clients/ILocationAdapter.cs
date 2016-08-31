﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.Services.Clients
{
    public interface ILocationAdapter
    {
        bool IsFor(IEnumerable<IServiceCapability> capabilities);
        bool IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer);
        bool IsFor(Address serviceAddress, string productType);
        bool IsFor(DomainModels.Accounts.ISubAccount subAccount);
        bool NeedProvider(Location location);

        string GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities);
        string GetSystemOfRecord();
        string GetCommodityType();
        Newtonsoft.Json.Linq.JObject GetProvider(IOffer offer);
        string GetProvider(DomainModels.Accounts.ISubAccount subAccount);

        LocationOfferSet LoadOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse);

        bool SkipPremiseVerification(Location location);

        dynamic ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account, string ExistingAccountNumber);

        DomainModels.Accounts.ISubAccount BuildSubAccount(Address serviceAddress, dynamic details);




        string GetProductId(DomainModels.Accounts.ISubAccount subAccount);

        string GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount);

        object GetProductRequest(Location location);

        IServiceCapability GetRenewalServiceCapability(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount);

        OfferPayment GetOfferPayment(dynamic streamAccountDetails, bool assessDeposit, IOfferOptionRules optionRules, IOfferOption option);

        bool HasSpecialCommercialEnrollment(IEnumerable<IServiceCapability> capabilities);

        void GetRenewalValues(IOffer offer, out string code, out string id);
    }
}
