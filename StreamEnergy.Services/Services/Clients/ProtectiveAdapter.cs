using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Enrollments;
using Protective = StreamEnergy.DomainModels.Enrollments.Protective;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments.Protective;
using StreamEnergy.DomainModels.Accounts;

namespace StreamEnergy.Services.Clients
{
    class ProtectiveAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public ProtectiveAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }


        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.Any(cap => cap is Protective.ServiceCapability);
        }

        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities, DomainModels.Enrollments.IOffer offer)
        {
            return offer.OfferType == Protective.Offer.Qualifier;
        }

        bool ILocationAdapter.IsFor(DomainModels.Address serviceAddress, string productType)
        {
            return productType == "Protective";
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return subAccount is ProtectiveAccount;
        }

        bool ILocationAdapter.NeedProvider(DomainModels.Enrollments.Location location)
        {
            throw new NotImplementedException();
        }

        string ILocationAdapter.GetUtilityAccountNumber(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            throw new NotImplementedException();
        }

        string ILocationAdapter.GetCommodityType()
        {
            return "Protective";
        }

        Newtonsoft.Json.Linq.JObject ILocationAdapter.GetProvider(DomainModels.Enrollments.IOffer offer)
        {
            throw new NotImplementedException();
        }

        string ILocationAdapter.GetProvider(DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        DomainModels.Enrollments.LocationOfferSet ILocationAdapter.LoadOffers(DomainModels.Enrollments.Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            return new LocationOfferSet();
        }

        private IEnumerable<Protective.Offer> GenerateOffers(dynamic product, SitecoreProductInfo productData)
        {
            return new List<Offer>();

        }

        private Offer GenerateSingleOffer(dynamic product, SitecoreProductInfo productData)
        {
            return new Offer();

        }

        private int GetSortOrder(string sortOrder)
        {
            int sortInt = 0;
            Int32.TryParse(sortOrder, out sortInt);
            return sortInt;
        }

        bool ILocationAdapter.SkipPremiseVerification(DomainModels.Enrollments.Location location)
        {
            return true;
        }

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account, bool IsAutoPayEnabled, string ExistingAccountNumber, DateTime DOB, string Gender)
        {
            var offerOption = (account.Offer.OfferOption as Protective.OfferOption);
            return new
            {
                ServiceType = "Protective",
                Key = account.EnrollmentAccountKey,
                RequestUniqueKey = account.RequestUniqueKey,
                ProductCode = account.Offer.Offer.Id,
                DOB = DOB.ToString("yyyy-MM-dd"),
                Gender = Gender,
                ActivationDate = offerOption.ActivationDate,
                UseInstallmentPlan = offerOption.UseInstallmentPlan,
                ExistingAccountNumber = ExistingAccountNumber,
            };
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(DomainModels.Address serviceAddress, dynamic details)
        {
            var productData = sitecoreProductData.GetProtectiveProductData((string)details.Plan.PlanId);

            return new ProtectiveAccount()
            {
                ActivationDate = (DateTime)details.ActivationDate,
            };
        }

        string ILocationAdapter.GetProductId(DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        string ILocationAdapter.GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        IServiceCapability ILocationAdapter.GetRenewalServiceCapability(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
        }

        object ILocationAdapter.GetProductRequest(DomainModels.Enrollments.Location location)
        {
            return new
            {
                ServiceType = "Protective",
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
            };
        }


        string ILocationAdapter.GetSystemOfRecord()
        {
            return "Ocenture";
        }

        DomainModels.Enrollments.OfferPayment ILocationAdapter.GetOfferPayment(dynamic streamAccountDetails, bool assessDeposit, DomainModels.Enrollments.IOfferOptionRules optionRules, DomainModels.Enrollments.IOfferOption option)
        {
            return new DomainModels.Enrollments.OfferPayment
            {
                EnrollmentAccountNumber = streamAccountDetails.Key.SystemOfRecordId,
                RequiredAmounts = ToRequiredAmount(streamAccountDetails.ProductCode, streamAccountDetails.Key),
                OngoingAmounts = new DomainModels.Enrollments.IOfferPaymentAmount[0],
                PostBilledAmounts = new DomainModels.Enrollments.IOfferPaymentAmount[0],
                AvailablePaymentMethods = (from type in (IEnumerable<dynamic>)streamAccountDetails.AcceptedEnrollmentPaymentAccountTypes
                    select new AvailablePaymentMethod { PaymentMethodType = type }).ToList(),
            };
        }

        private DomainModels.Enrollments.IOfferPaymentAmount[] ToRequiredAmount(dynamic ProductCode, dynamic key)
        {
            string query = "/sitecore/content/Data/Taxonomy/Products/Protective//*[@@templateid='{2435BB90-E224-403E-B37B-4872C4F279F7}' and @ID='" + ProductCode.ToString() + "']";
            var ProductItem = Sitecore.Context.Database.SelectItems(query).First();
            var ProductSubofferGuids = ProductItem.Fields["Services"].Value.Split('|');
            float price = 0;
            float discount = 0;
            var Suboffers = (from service in Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Products/Protective/Services").Children
                             select new Service
                             {
                                 Guid = service.ID.ToString(),
                                 Price = float.TryParse(service.Fields["Price"].Value, out price) ? price : -1,
                                 ThreeServiceDiscount = float.TryParse(service.Fields["Three Service Discount"].Value, out discount) ? discount : -1,
                                 IsGroupOffer = service.Fields["Is Group Offer"].Value == "1",
                             }).ToArray();
            int offerCount = 0;
            float total = 0;
            float totalDiscount = 0;
            List<Service> ProductSuboffers = new List<Service>();
            foreach (string guid in ProductSubofferGuids)
            {
                var suboffer = Suboffers.First(so => so.Guid == guid);
                ProductSuboffers.Add(suboffer);
                if (suboffer.IsGroupOffer) offerCount += 2;
                else offerCount += 1;
                total += suboffer.Price;
                totalDiscount += suboffer.ThreeServiceDiscount;
            }
            if (offerCount > 2) total -= totalDiscount;

            return new[] 
            {  
                new Protective.TotalPaymentAmount 
                {
                    DollarAmount = Convert.ToDecimal(total),
                    TaxTotal = 0,
                    SubTotal = Convert.ToDecimal(total),
                    SystemOfRecord = key.SystemOfRecord,
                    DepositAccount = key.SystemOfRecordId,
                }
            };
        }


        bool ILocationAdapter.HasSpecialCommercialEnrollment(IEnumerable<IServiceCapability> capabilities)
        {
            return false;
        }


        void ILocationAdapter.GetRenewalValues(IOffer offer, out string code, out string id)
        {
            throw new NotImplementedException();
        }
    }
}
