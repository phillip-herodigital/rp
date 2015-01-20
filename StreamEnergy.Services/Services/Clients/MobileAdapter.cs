﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.DomainModels.Enrollments;
using Mobile = StreamEnergy.DomainModels.Enrollments.Mobile;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments.Mobile;
using StreamEnergy.DomainModels.Accounts;

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
            return productType == "Mobile";
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return subAccount is MobileAccount;
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
                          where productData.Fields["Hide Plan"] != "1"
                          where product.MobileInventory != null
                          let childOffer = streamConnectProductResponse.Products.FirstOrDefault(p => p.ParentGroupProductId == product.ProductId)
                          from offer in (IEnumerable<Mobile.Offer>)GenerateOffers(product, productData, childOffer)
                          select offer).ToArray()
            };
        }

        private IEnumerable<Mobile.Offer> GenerateOffers(dynamic product, SitecoreProductInfo productData, dynamic childOffer)
        {
            yield return GenerateSingleOffer(product, productData, childOffer, false);
            if (childOffer != null)
            {
                yield return GenerateSingleOffer(childOffer, productData, null, true);
            }
        }

        private Offer GenerateSingleOffer(dynamic product, SitecoreProductInfo productData, dynamic childOffer, bool isChildOffer)
        {
            return new Mobile.Offer
            {
                Id = product.ProductId,
                Provider = product.Provider.ToString(),
                Code = product.ProductCode,
                Product = Newtonsoft.Json.JsonConvert.SerializeObject(product),

                ChildOfferId = (childOffer != null) ? childOffer.ProductId : null,
                IsParentOffer = (product.IsParentGroup != null) ? product.IsParentGroup : false,
                IsChildOffer = isChildOffer,

                Name = productData.Fields["Name"],
                Description = productData.Fields["Name"],
                Data = productData.Fields["Data"],
                HoursMusic = productData.Fields["Hours Music"],
                HoursMovies = productData.Fields["Hours Movies"],
                WebPages = productData.Fields["Web Pages"],
                Recommended = productData.Fields["Recommended"] == "1" ? true : false,
                SpecialOffer = productData.Fields["Special Offer"] == "1" ? true : false,
                SpecialOfferText = productData.Fields["Special Offer Text"],
                SpecialOfferOriginalPrice = productData.Fields["Special Offer Original Price"],

                Rates = new[] {
                                  new Mobile.Rate { RateAmount = ((IEnumerable<dynamic>)product.Rates).First(r => r.EnergyType == "Average").Value }
                              },
                MobileInventory = (from inventoryType in (IEnumerable<dynamic>)product.MobileInventory
                                   let inventoryData = sitecoreProductData.GetMobileInventoryData((string)inventoryType.Id)
                                   where inventoryData != null
                                   select new Mobile.MobileInventory
                                   {
                                       Id = (string)inventoryType.Id,
                                       TypeId = (string)inventoryType.TypeId,
                                       Price = Convert.ToDecimal(inventoryType.Price.ToString()),
                                       InstallmentPlan = GetInstallmentPlanIds(inventoryData, supportedInventoryTypes: product.MobileInventory),
                                   }).ToArray(),

                Footnotes = productData.Footnotes,

            };
        }

        private InstallmentPlanDetails GetInstallmentPlanIds(SitecoreProductInfo inventoryData, IEnumerable<dynamic> supportedInventoryTypes)
        {
            var mandatoryIds = new string[] { inventoryData.Fields["A Group SKU"], inventoryData.Fields["B Group SKU"], inventoryData.Fields["C Group SKU"] };

            // The "supportedInventoryTypes" are configured on BeQuick's system. If one doesn't match, then we can't offer the installment plan for this product.
            var isInstallmentPlanAvailable = mandatoryIds.All(id => (from inventoryType in supportedInventoryTypes
                                                                     select (string)inventoryType.Id).Contains(id));
            return new InstallmentPlanDetails
            {
                IsAvailable = isInstallmentPlanAvailable,
                Price = isInstallmentPlanAvailable ? Convert.ToDecimal((string)(supportedInventoryTypes.First(inv => inv.Id == mandatoryIds[0])).Price.ToString()) : 0,
                ByCreditRating = new CreditRatingInstallmentPlan
                {
                    A = inventoryData.Fields["A Group SKU"],
                    B = inventoryData.Fields["B Group SKU"],
                    C = inventoryData.Fields["B Group SKU"],
                },
            };
        }

        bool ILocationAdapter.SkipPremiseVerification(DomainModels.Enrollments.Location location)
        {
            return true;
        }

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account)
        {
            var offer = (account.Offer.Offer as Mobile.Offer);
            var offerOption = (account.Offer.OfferOption as Mobile.OfferOption);
            var selectedInventory = offer.MobileInventory.First(mi => mi.Id == offerOption.InventoryItemId);
            return new
            {
                ServiceType = "Mobile",
                Key = account.EnrollmentAccountKey,
                RequestUniqueKey = account.RequestUniqueKey,

                MobileProvider = offer.Provider,
                PhoneNumber = offerOption.PhoneNumber,
                PlanId = account.Offer.Offer.Id,
                ActivationDate = offerOption.ActivationDate,
                EsnNumber = offerOption.EsnNumber,
                SimNumber = offerOption.SimNumber,
                ImeiNumber = offerOption.ImeiNumber,
                InventoryItemId = offerOption.InventoryItemId,
                TransferPhoneNumber = offerOption.TransferPhoneNumber,
                UseInstallmentPlan = offerOption.UseInstallmentPlan,
                InventoryInstallmentPlanByCredit = offerOption.UseInstallmentPlan
                    ? new { A = selectedInventory.InstallmentPlan.ByCreditRating.A, B = selectedInventory.InstallmentPlan.ByCreditRating.B, C = selectedInventory.InstallmentPlan.ByCreditRating.C }
                    : null,
            };
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(DomainModels.Address serviceAddress, dynamic details)
        {
            var productData = sitecoreProductData.GetMobileProductData((string)details.Plan.PlanId);
            return new MobileAccount()
            {
                PhoneNumber = details.PhoneNumber,
                SerialNumber = details.SerialNumber,
                EquipmentId = details.EquipmentId,
                PlanId = details.Plan.PlanId,
                PlanPrice = (double)details.Plan.Price,
                PlanDataAvailable = productData != null ? Convert.ToDouble(productData.Fields["Data"]) : 0,
                PlanName = details.Plan.Name,
                ParentGroupProductId = details.Plan.ParentGroupProductId,
                IsParentGroup = (bool)details.Plan.IsParentGroup,
                Carrier = details.Carrier,
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
                new Mobile.TotalPaymentAmount 
                {
                    DollarAmount = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Total").Amount.ToString()),
                    TaxTotal = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Tax Total").Amount.ToString()),
                    SubTotal = Convert.ToDecimal(streamConnectFees.Single(fee => fee.Name == "Sub Total").Amount.ToString()),
                    ActivationFee = Convert.ToDecimal((streamConnectFees.Where(fee => fee.Name == "Activation Fee").Select(fee => fee.Amount).SingleOrDefault() ?? "0").ToString()),
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
