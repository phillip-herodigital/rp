﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using PennsylvaniaElectricity = StreamEnergy.DomainModels.Enrollments.PennsylvaniaElectricity;
using StreamEnergy.DomainModels.Accounts;


namespace StreamEnergy.Services.Clients
{
    class PennsylvaniaElectricityAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public PennsylvaniaElectricityAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }

        bool ILocationAdapter.IsFor(Location location)
        {
            if (location.Capabilities.OfType<StreamEnergy.DomainModels.Enrollments.PennsylvaniaGas.ServiceCapability>().Any() && !location.Capabilities.OfType<PennsylvaniaElectricity.ServiceCapability>().Any())
            {
                return false;
            }
            return location.Address.StateAbbreviation == "PA";
        }

        bool ILocationAdapter.IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer)
        {
            return offer.OfferType == PennsylvaniaElectricity.Offer.Qualifier;
        }

        bool ILocationAdapter.IsFor(Address serviceAddress, string productType)
        {
            return serviceAddress.StateAbbreviation == "PA" && productType == "Electricity";
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return subAccount is DomainModels.Accounts.PennsylvaniaElectricityAccount;
        }

        bool ILocationAdapter.NeedProvider(Location location)
        {
            return true;
        }

        string ILocationAdapter.GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities)
        {
            var capability = capabilities.OfType<PennsylvaniaElectricity.ServiceCapability>().Single();
            return capability.PreviousAccountNumber;
        }

        string ILocationAdapter.GetSystemOfRecord()
        {
            return "ISTA";
        }

        string ILocationAdapter.GetCommodityType()
        {
            return "Electricity";
        }

        DomainModels.Enrollments.LocationOfferSet ILocationAdapter.LoadOffers(DomainModels.Enrollments.Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();
            if (customerType.CustomerType == EnrollmentCustomerType.Residential)
            {
                return LoadPennsylvaniaOffers(location, streamConnectProductResponse);
            }
            else
            {
                return new LocationOfferSet
                {
                    Offers = new[] {
                            new PennsylvaniaElectricity.CommercialQuote { }
                    }
                };
            }
        }

        private LocationOfferSet LoadPennsylvaniaOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();
            return new LocationOfferSet
            {
                Offers = (from product in streamConnectProductResponse.Products
                          where product.ProductType == "Electricity"
                          group product by product.ProductCode into products
                          let product = products.First()
                          let productData = sitecoreProductData.GetPennsylvaniaElectricityProductData(product.ProductCode.ToString())
                          where productData != null
                          select new PennsylvaniaElectricity.Offer
                          {
                              Id = product.Provider["Name"].ToString() + "/" + product.ProductId,
                              Provider = product.Provider.ToString(),
                              Code = product.ProductCode,
                              Product = Newtonsoft.Json.JsonConvert.SerializeObject(product),
                              EnrollmentType = serviceStatus.EnrollmentType,
                              Name = productData.Fields["Name"],
                              Description = System.Web.HttpUtility.HtmlEncode(productData.Fields["Description"]),
                              Rate = System.Convert.ToDecimal(productData.Fields["Rate"]),
                              TermMonths = product.Term,
                              RateType = ((IEnumerable<dynamic>)product.Rates).Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              CancellationFee = productData.Fields["Early Termination Fee"],
                              MonthlyServiceCharge = productData.Fields["Monthly Service Charge"],
                              Footnotes = productData.Footnotes,
                              Documents = new Dictionary<string, Uri>
                              {
                                  { "LetterOfAgency", new Uri(productData.Fields["Letter of Agency"], UriKind.Relative) },
                                  { "TermsAndDisclosures", new Uri(productData.Fields["Terms and Disclosures"], UriKind.Relative) },
                              }
                          }).ToArray()
            };
        }

        bool ILocationAdapter.SkipPremiseVerification(Location location)
        {
            return true;
        }

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account, bool IsAutoPayEnabled, string ExistinPAccountNumber, DateTime DOB, string Gender)
        {
            var PennsylvaniaElectricityOffer = account.Offer.Offer as PennsylvaniaElectricity.Offer;
            var PennsylvaniaElectricityService = account.Location.Capabilities.OfType<PennsylvaniaElectricity.ServiceCapability>().Single();
            var serviceStatus = account.Location.Capabilities.OfType<ServiceStatusCapability>().Single();
            var customerType = account.Location.Capabilities.OfType<CustomerTypeCapability>().Single();

            return new
            {
                ServiceType = "Utility",
                Key = account.EnrollmentAccountKey,
                RequestUniqueKey = account.RequestUniqueKey,

                Premise = new
                {
                    EnrollmentType = serviceStatus.EnrollmentType.ToString("g"),
                    SelectedMoveInDate = DateTime.Now,
                    SelectedTurnOnTime = "Undefined",
                    UtilityProvider = JObject.Parse(PennsylvaniaElectricityOffer.Provider),
                    UtilityAccountNumber = (account.Offer.OfferOption is PennsylvaniaElectricity.SwitchOfferOption) ? ((PennsylvaniaElectricity.SwitchOfferOption)account.Offer.OfferOption).PreviousAccountNumber : PennsylvaniaElectricityService.PreviousAccountNumber,
                    Product = JObject.Parse(PennsylvaniaElectricityOffer.Product),
                    ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(account.Location.Address),
                    ProductType = "Electricity",
                    Deposit = StreamConnectUtilities.ToStreamConnectDeposit(account.OfferPayments, account.Offer.WaiveDeposit),
                }
            };
        }

        JObject ILocationAdapter.GetProvider(IOffer offer)
        {
            if (offer is PennsylvaniaElectricity.Offer)
            {
                return JObject.Parse(((PennsylvaniaElectricity.Offer)offer).Provider);
            }
            return null;
        }

        string ILocationAdapter.GetProvider(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.PennsylvaniaElectricityAccount;

            return account.ProviderId;
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(Address serviceAddress, dynamic details)
        {
            var result = new DomainModels.Accounts.PennsylvaniaElectricityAccount
            {
                Id = details.UtilityAccountNumber,
                ServiceAddress = serviceAddress
            };

            if (details.Product != null)
            {
                var productData = sitecoreProductData.GetPennsylvaniaElectricityProductData((string)details.Product.ProductCode) ?? new SitecoreProductInfo
                {
                    Fields = new System.Collections.Specialized.NameValueCollection()
                };

                var rate = (details.Product.Rates != null && details.Product.Rates.Count > 0) ? details.Product.Rates[0] : null;

                result.ProviderId = details.UtilityProvider.Id;
                result.Rate = (rate != null) ? (decimal)(rate.Value ?? 0) : 0;
                result.RateType = (rate != null && rate.Type == "Fixed") ? RateType.Fixed : RateType.Variable;
                result.TermMonths = details.Product.Term;
                result.ProductId = details.Product.ProductId;
                result.ProductCode = details.Product.ProductCode;
                result.ProductName = productData.Fields["Name"] ?? details.Product.Name;
                result.ProductDescription = productData.Fields["Description"] ?? details.Product.Description;
                result.EarlyTerminationFee = productData.Fields["Early Termination Fee"];
                result.CustomerType = (details.CustomerType == "Residential") ? EnrollmentCustomerType.Residential : EnrollmentCustomerType.Commercial;
            }
            return result;
        }

        string ILocationAdapter.GetProductId(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.PennsylvaniaElectricityAccount;
            return account.ProductId;
        }

        string ILocationAdapter.GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.PennsylvaniaElectricityAccount;
            return account.Id;
        }

        IServiceCapability ILocationAdapter.GetRenewalServiceCapability(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount)
        {
            return new StreamEnergy.DomainModels.Enrollments.PennsylvaniaElectricity.RenewalCapability { Account = account, SubAccount = subAccount };
        }

        object ILocationAdapter.GetProductRequest(Location location)
        {
            return new
            {
                ServiceType = "Utility",
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
            };
        }

        OfferPayment ILocationAdapter.GetOfferPayment(dynamic entry, bool assessDeposit, IOfferOptionRules optionRules, IOfferOption option)
        {
            decimal deposit = 0;
            if (assessDeposit && entry.Premise.Deposit != null)
                deposit = (decimal)entry.Premise.Deposit.Amount.Value;
            return new OfferPayment
            {
                EnrollmentAccountNumber = entry.EnrollmentAccountNumber,
                OngoingAmounts = new IOfferPaymentAmount[]
                        {
                        },
                RequiredAmounts = new IOfferPaymentAmount[]
                        {
                            new DepositOfferPaymentAmount { DollarAmount = deposit, SystemOfRecord = entry.Key.SystemOfRecord, DepositAccount = entry.Key.SystemOfRecordId }
                        },
                PostBilledAmounts = optionRules.GetPostBilledPayments(option),
                AvailablePaymentMethods = (from type in (IEnumerable<dynamic>)entry.AcceptedEnrollmentPaymentAccountTypes
                                           select new AvailablePaymentMethod { PaymentMethodType = type }).ToList(),
            };
        }


        bool ILocationAdapter.HasSpecialCommercialEnrollment(IEnumerable<IServiceCapability> capabilities)
        {
            return capabilities.OfType<CustomerTypeCapability>().SingleOrDefault().CustomerType == EnrollmentCustomerType.Commercial;
        }


        void ILocationAdapter.GetRenewalValues(IOffer offer, out string code, out string id)
        {
            var PennsylvaniaElectricityOffer = offer as PennsylvaniaElectricity.Offer;
            code = PennsylvaniaElectricityOffer.Code;
            id = PennsylvaniaElectricityOffer.Id.Split(new[] { '/' }, 2)[1];
        }
    }
}
