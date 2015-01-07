using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using GeorgiaGas = StreamEnergy.DomainModels.Enrollments.GeorgiaGas;


namespace StreamEnergy.Services.Clients
{
    class GeorgiaAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public GeorgiaAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }

        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.OfType<GeorgiaGas.ServiceCapability>().Any();            
        }

        bool ILocationAdapter.IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer)
        {
            return offer.OfferType == GeorgiaGas.Offer.Qualifier;
        }

        bool ILocationAdapter.IsFor(Address serviceAddress, string productType)
        {
            return serviceAddress.StateAbbreviation == "GA" && productType == "Gas";
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return subAccount is DomainModels.Accounts.GeorgiaGasAccount;
        }

        bool ILocationAdapter.NeedProvider(Location location)
        {
            return true;
        }

        string ILocationAdapter.GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities)
        {
            var capability = capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            return capability.AglcPremisesNumber;
        }

        string ILocationAdapter.GetSystemOfRecord()
        {
            return "ISTA";
        }

        string ILocationAdapter.GetCommodityType()
        {
            return "Gas";
        }

        DomainModels.Enrollments.LocationOfferSet ILocationAdapter.LoadOffers(DomainModels.Enrollments.Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();
            if (customerType.CustomerType == EnrollmentCustomerType.Residential)
            {
                return LoadGeorgiaOffers(location, streamConnectProductResponse);
            }
            else
            {
                return new LocationOfferSet
                {
                    Offers = new[] {
                            new GeorgiaGas.CommercialQuote { }
                        }
                };
            }
        }

        private LocationOfferSet LoadGeorgiaOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            var georgiaService = location.Capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();


            return new LocationOfferSet
            {
                Offers = (from product in streamConnectProductResponse.Products
                          where ((IEnumerable<dynamic>)product.Rates).Any(r => r.Unit == "Therm")
                          group product by product.ProductCode into products
                          let product = products.First()
                          let productData = sitecoreProductData.GetGeorgiaGasProductData(product.ProductCode.ToString())
                          where productData != null
                          select new GeorgiaGas.Offer
                          {
                              Id = product.Provider["Name"].ToString() + "/" + product.ProductId,
                              Provider = product.Provider.ToString(),
                              Code = product.ProductCode,
                              Product = Newtonsoft.Json.JsonConvert.SerializeObject(product),

                              EnrollmentType = serviceStatus.EnrollmentType,

                              Name = productData.Fields["Name"],
                              Description = productData.Fields["Description"],

                              Rate = ((IEnumerable<dynamic>)product.Rates).First(r => r.EnergyType == "Average").Value,
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
            var capability = location.Capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            return capability.AglcPremisesNumber == null;
        }

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account)
        {
            var georgiaGasOffer = account.Offer.Offer as GeorgiaGas.Offer;
            var georgiaGasService = account.Location.Capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
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
                    SelectedMoveInDate = (account.Offer.OfferOption is GeorgiaGas.MoveInOfferOption) ? ((GeorgiaGas.MoveInOfferOption)account.Offer.OfferOption).ConnectDate : DateTime.Now,
                    UtilityProvider = JObject.Parse(georgiaGasOffer.Provider),
                    UtilityAccountNumber = (account.Offer.OfferOption is GeorgiaGas.SwitchOfferOption) ? ((GeorgiaGas.SwitchOfferOption)account.Offer.OfferOption).AglcNumber : georgiaGasService.AglcPremisesNumber,
                    Product = JObject.Parse(georgiaGasOffer.Product),
                    ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(account.Location.Address),
                    ProductType = "Gas",
                    Deposit = StreamConnectUtilities.ToStreamConnectDeposit(account.OfferPayments, account.Offer.WaiveDeposit),
                }
            };
        }

        JObject ILocationAdapter.GetProvider(IOffer offer)
        {
            if (offer is GeorgiaGas.Offer)
            {
                return JObject.Parse(((GeorgiaGas.Offer)offer).Provider);
            }
            return null;
        }

        string ILocationAdapter.GetProvider(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.GeorgiaGasAccount;

            return account.ProviderId;
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(Address serviceAddress, dynamic details)
        {
            var result = new DomainModels.Accounts.GeorgiaGasAccount
            {
                Id = details.UtilityAccountNumber,
                ServiceAddress = serviceAddress
            };

            if (details.Product != null)
            {
                var productData = sitecoreProductData.GetGeorgiaGasProductData((string)details.Product.ProductCode) ?? new SitecoreProductInfo
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
                result.CustomerType = details.CustomerType;
                result.ProductType = details.ProductType;
            }
            return result;
        }

        string ILocationAdapter.GetProductId(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.GeorgiaGasAccount;
            return account.ProductId;
        }

        string ILocationAdapter.GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.GeorgiaGasAccount;
            return account.Id;
        }

        IServiceCapability ILocationAdapter.GetRenewalServiceCapability(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount)
        {
            return new StreamEnergy.DomainModels.Enrollments.GeorgiaGas.RenewalCapability { Account = account, SubAccount = subAccount };
        }

        object ILocationAdapter.GetProductRequest(Location location)
        {
            return new
            {
                ServiceType = "Utility",
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
                UtilityAccountNumber = ((ILocationAdapter)this).GetUtilityAccountNumber(location.Capabilities),
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
                            new DepositOfferPaymentAmount { DollarAmount = deposit, SystemOfRecord = entry.SystemOfRecord, DepositAccount = entry.SystemOfRecordAccountNumber }
                        },
                PostBilledAmounts = optionRules.GetPostBilledPayments(option)
            };
        }


        bool ILocationAdapter.HasSpecialCommercialEnrollment(IEnumerable<IServiceCapability> capabilities)
        {
            return capabilities.OfType<CustomerTypeCapability>().SingleOrDefault().CustomerType == EnrollmentCustomerType.Commercial;
        }
    }
}
