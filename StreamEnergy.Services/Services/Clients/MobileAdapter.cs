using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Enrollments;
using Mobile = StreamEnergy.DomainModels.Enrollments.Mobile;
using StreamEnergy.DomainModels;

namespace StreamEnergy.Services.Clients
{
    class MobileAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public MobileAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }


        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.Any(cap => cap is Mobile.ServiceCapability);
        }

        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities, DomainModels.Enrollments.IOffer offer)
        {
            return offer.OfferType == Mobile.Offer.Qualifier;
        }

        bool ILocationAdapter.IsFor(DomainModels.Address serviceAddress, string productType)
        {
            throw new NotImplementedException();
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            throw new NotImplementedException();
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
            return "Mobile";
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
            return new DomainModels.Enrollments.LocationOfferSet
            {
                Offers = (from product in streamConnectProductResponse.Products
                          let productData = sitecoreProductData.GetMobileProductData((string)product.ProductId)
                          where productData != null
                          where product.MobileInventory != null
                          select new Mobile.Offer
                          {
                              Id = product.ProductId,
                              Provider = product.Provider.ToString(),
                              Code = product.ProductCode,
                              Product = Newtonsoft.Json.JsonConvert.SerializeObject(product),

                              //EnrollmentType = serviceStatus.EnrollmentType,

                              Name = productData.Fields["Name"],
                              Description = productData.Fields["Description"],

                              Rates = new[] {
                                  new Rate { RateAmount = ((IEnumerable<dynamic>)product.Rates).First(r => r.EnergyType == "Average").Value }
                              },
                              MobileInventory = (from inventoryType in (IEnumerable<dynamic>)product.MobileInventory
                                                 let inventoryData = sitecoreProductData.GetMobileInventoryData((string)inventoryType.Id)
                                                 select new MobileInventory
                                                 {
                                                     Id = (string)inventoryType.Id,
                                                     TypeId = (string)inventoryType.TypeId,
                                                     Name = inventoryData.Fields["Name"],
                                                     Price = Convert.ToDecimal(inventoryType.Price.ToString()),
                                                 }).ToArray(),
                              //TermMonths = product.Term,
                              //RateType = product.Rates.Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              //CancellationFee = productData.Fields["Early Termination Fee"],
                              //MonthlyServiceCharge = productData.Fields["Monthly Service Charge"],

                              Footnotes = productData.Footnotes,

                              //Documents = new Dictionary<string, Uri>
                              //{
                              //    { "LetterOfAgency", new Uri(productData.Fields["Letter of Agency"], UriKind.Relative) },
                              //    { "TermsAndDisclosures", new Uri(productData.Fields["Terms and Disclosures"], UriKind.Relative) },
                              //}
                          }).ToArray()
            };
        }

        bool ILocationAdapter.SkipPremiseVerification(DomainModels.Enrollments.Location location)
        {
            return true;
        }

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account)
        {
            return new
            {
                ServiceType = "Mobile",
                Key = account.EnrollmentAccountKey,
                RequestUniqueKey = account.RequestUniqueKey,

                MobileProvider = (account.Offer.Offer as Mobile.Offer).Provider,
                PhoneNumber = (account.Offer.OfferOption as Mobile.OfferOption).PhoneNumber,
                PlanId = account.Offer.Offer.Id,
                ActivationDate = (account.Offer.OfferOption as Mobile.OfferOption).ActivationDate,
                EsnNumber = (account.Offer.OfferOption as Mobile.OfferOption).EsnNumber,
                SimNumber = (account.Offer.OfferOption as Mobile.OfferOption).SimNumber,
                ImeiNumber = (account.Offer.OfferOption as Mobile.OfferOption).ImeiNumber,
                TransferPhoneNumber = (account.Offer.OfferOption as Mobile.OfferOption).TransferPhoneNumber,
            };
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(DomainModels.Address serviceAddress, dynamic details)
        {
            throw new NotImplementedException();
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
                ServiceType = "Mobile",
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
            };
        }


        string ILocationAdapter.GetSystemOfRecord()
        {
            return "BeQuick";
        }

        DomainModels.Enrollments.OfferPayment ILocationAdapter.GetOfferPayment(dynamic streamAccountDetails, bool assessDeposit, DomainModels.Enrollments.IOfferOptionRules optionRules, DomainModels.Enrollments.IOfferOption option)
        {
            return new DomainModels.Enrollments.OfferPayment
            {
                EnrollmentAccountNumber = streamAccountDetails.Key.SystemOfRecordId,
                RequiredAmounts = ToRequiredAmount((IEnumerable<dynamic>)streamAccountDetails.InitialPayments, streamAccountDetails.Key),
                OngoingAmounts = new DomainModels.Enrollments.IOfferPaymentAmount[0],
                PostBilledAmounts = new DomainModels.Enrollments.IOfferPaymentAmount[0],
            };
        }

        private DomainModels.Enrollments.IOfferPaymentAmount[] ToRequiredAmount(IEnumerable<dynamic> streamConnectFees, dynamic key)
        {
            if (!streamConnectFees.Any())
            {
                return new DomainModels.Enrollments.IOfferPaymentAmount[0];
            }
            return new[] 
            {  
                new TotalPaymentAmount 
                {
                    DollarAmount = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Total").Amount.ToString()),
                    TaxTotal = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Tax Total").Amount.ToString()),
                    SubTotal = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Sub Total").Amount.ToString()),
                    SystemOfRecord = key.SystemOfRecord,
                    DepositAccount = key.SystemOfRecordId,
                }
            };
        }
    }
}
