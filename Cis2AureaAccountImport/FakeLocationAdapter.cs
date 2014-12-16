using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using StreamEnergy.Services.Clients;

namespace Cis2AureaAccountImport
{
    class FakeLocationAdapter : ILocationAdapter
    {
        public bool IsFor(IEnumerable<StreamEnergy.DomainModels.IServiceCapability> capabilities)
        {
            return true;
        }

        public bool IsFor(IEnumerable<StreamEnergy.DomainModels.IServiceCapability> capabilities, StreamEnergy.DomainModels.Enrollments.IOffer offer)
        {
            return true;
        }

        public bool IsFor(StreamEnergy.DomainModels.Address serviceAddress, string productType)
        {
            return true;
        }

        public bool IsFor(StreamEnergy.DomainModels.Accounts.ISubAccount subAccount)
        {
            return true;
        }

        public bool NeedProvider(StreamEnergy.DomainModels.Enrollments.Location location)
        {
            throw new NotImplementedException();
        }

        public string GetUtilityAccountNumber(IEnumerable<StreamEnergy.DomainModels.IServiceCapability> capabilities)
        {
            throw new NotImplementedException();
        }

        public string GetSystemOfRecord()
        {
            throw new NotImplementedException();
        }

        public string GetCommodityType()
        {
            throw new NotImplementedException();
        }

        public Newtonsoft.Json.Linq.JObject GetProvider(StreamEnergy.DomainModels.Enrollments.IOffer offer)
        {
            throw new NotImplementedException();
        }

        public string GetProvider(StreamEnergy.DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        public StreamEnergy.DomainModels.Enrollments.LocationOfferSet LoadOffers(StreamEnergy.DomainModels.Enrollments.Location location, StreamEnergy.Services.Clients.StreamConnect.ProductResponse streamConnectProductResponse)
        {
            throw new NotImplementedException();
        }

        public bool SkipPremiseVerification(StreamEnergy.DomainModels.Enrollments.Location location)
        {
            throw new NotImplementedException();
        }

        public StreamEnergy.DomainModels.Accounts.ISubAccount BuildSubAccount(StreamEnergy.DomainModels.Address serviceAddress, dynamic details)
        {
            return new FakeSubAccount();
        }

        public string GetProductId(StreamEnergy.DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        public string GetUtilityAccountNumber(StreamEnergy.DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        public object GetProductRequest(StreamEnergy.DomainModels.Enrollments.Location location)
        {
            throw new NotImplementedException();
        }

        public dynamic ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account)
        {
            throw new NotImplementedException();
        }

        public StreamEnergy.DomainModels.Enrollments.OfferPayment GetOfferPayment(dynamic streamAccountDetails, bool assessDeposit, StreamEnergy.DomainModels.Enrollments.IOfferOptionRules optionRules, StreamEnergy.DomainModels.Enrollments.IOfferOption option)
        {
            throw new NotImplementedException();
        }
    }
}
