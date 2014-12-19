using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using TexasElectricity = StreamEnergy.DomainModels.Enrollments.TexasElectricity;

namespace StreamEnergy.Services.Clients
{
    class TexasAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public TexasAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }

        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.OfType<TexasElectricity.ServiceCapability>().Any();
        }

        bool ILocationAdapter.IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer)
        {
            return offer.OfferType == TexasElectricity.Offer.Qualifier;
        }

        bool ILocationAdapter.IsFor(Address serviceAddress, string productType)
        {
            return serviceAddress.StateAbbreviation == "TX" && productType == "Electricity";
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return subAccount is DomainModels.Accounts.TexasElectricityAccount;
        }

        bool ILocationAdapter.NeedProvider(Location location)
        {
            return false;
        }

        string ILocationAdapter.GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities)
        {
            var capability = capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            return capability.EsiId;
        }

        string ILocationAdapter.GetSystemOfRecord(IEnumerable<IServiceCapability> capabilities)
        {
            var capability = capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            return "CIS1";
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
                return LoadTexasOffers(location, streamConnectProductResponse);
            }
            else
            {
                return new LocationOfferSet
                {
                    Offers = new[] {
                            new TexasElectricity.CommercialQuote { }
                        }
                };
            }
        }


        private LocationOfferSet LoadTexasOffers(Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            if (location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Count() != 1)
            {
                return new LocationOfferSet { OfferSetErrors = { { "TexasElectricity", "MultipleTdu" } } };
            }
            var texasService = location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();

            var providerName = texasService.Tdu;

            return new LocationOfferSet
            {
                Offers = (from product in streamConnectProductResponse.Products
                          // Only supporting $/kwh for Texas enrollments, at least for now. Making sure that our `* 100` below doesn't cause a bug...
                          where product.Rates.All(r => r.Unit == "$/kwh")
                          group product by product.ProductCode into products
                          let product = products.First(p => p.Provider["Name"].ToString() == providerName)
                          let productData = sitecoreProductData.GetTexasElectricityProductData(product)
                          where productData != null
                          select new TexasElectricity.Offer
                          {
                              Id = product.Provider["Name"].ToString() + "/" + product.ProductId,
                              Provider = product.Provider.ToString(),

                              EnrollmentType = serviceStatus.EnrollmentType,

                              Name = productData.Fields["Name"],
                              Description = productData.Fields["Description"],

                              Rate = product.Rates.First(r => r.EnergyType == "Average").Value * 100,
                              StreamEnergyCharge = product.Rates.First(r => r.EnergyType == "Energy").Value * 100,
                              MinimumUsageFee = productData.Fields["Minimum Usage Fee"],
                              TduCharges = productData.Fields["TDU Charges"],
                              TermMonths = product.Term,
                              RateType = product.Rates.Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              TerminationFee = product.Fees.Where(fee => fee.Name == "Early Termination Fee").Select(fee => fee.Amount).FirstOrDefault(),

                              Footnotes = productData.Footnotes,

                              Documents = new Dictionary<string, Uri> 
                              {
                                  { "ElectricityFactsLabel", new Uri(productData.Fields["Energy Facts Label"], UriKind.Relative) },
                                  { "TermsOfService", new Uri(productData.Fields["Terms Of Service"], UriKind.Relative) },
                                  { "YourRightsAsACustomer", new Uri(productData.Fields["Your Rights As A Customer"], UriKind.Relative) },
                              }
                          }).ToArray()
            };
        }

        bool ILocationAdapter.SkipPremiseVerification(Location location)
        {
            var capability = location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            return capability.EsiId == null;
        }



        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, UserContext context, LocationServices service, SelectedOffer offer, Newtonsoft.Json.Linq.JObject salesInfo, Guid? enrollmentAccountId, dynamic depositObject)
        {
            var texasElectricityOffer = offer.Offer as TexasElectricity.Offer;
            var texasService = service.Location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            var serviceStatus = service.Location.Capabilities.OfType<ServiceStatusCapability>().Single();
            var customerType = service.Location.Capabilities.OfType<CustomerTypeCapability>().Single();
            return new
            {
                GlobalCustomerId = globalCustomerId.ToString(),
                SalesInfo = salesInfo,
                CustomerType = customerType.CustomerType.ToString("g"),
                EnrollmentAccountId = enrollmentAccountId ?? Guid.Empty,
                FirstName = context.ContactInfo.Name.First,
                LastName = context.ContactInfo.Name.Last,
                BillingAddress = StreamConnectUtilities.ToStreamConnectAddress(context.MailingAddress),
                HomePhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Home).Select(p => p.Number).SingleOrDefault(),
                CellPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Mobile).Select(p => p.Number).SingleOrDefault(),
                WorkPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Work).Select(p => p.Number).SingleOrDefault(),
                SSN = context.SocialSecurityNumber,
                CurrentProvider = context.PreviousProvider,
                EmailAddress = context.ContactInfo.Email.Address,
                Premise = new
                {
                    EnrollmentType = serviceStatus.EnrollmentType.ToString("g"),
                    SelectedMoveInDate = (offer.OfferOption is TexasElectricity.MoveInOfferOption) ? ((TexasElectricity.MoveInOfferOption)offer.OfferOption).ConnectDate : DateTime.Now,
                    UtilityProvider = JObject.Parse(texasElectricityOffer.Provider),
                    UtilityAccountNumber = texasService.EsiId,
                    Product = new
                    {
                        ProductId = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1],
                        ProductCode = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1],
                        Term = texasElectricityOffer.TermMonths
                    },
                    ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(service.Location.Address),
                    ProductType = "Electricity",
                    Deposit = depositObject
                }
            };
        }

        JObject ILocationAdapter.GetProvider(IOffer offer)
        {
            return null;
        }

        string ILocationAdapter.GetProvider(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.TexasElectricityAccount;

            return account.ProviderId;
        }

        DomainModels.Accounts.ISubAccount ILocationAdapter.BuildSubAccount(Address serviceAddress, dynamic details)
        {
            var result = new DomainModels.Accounts.TexasElectricityAccount
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
            var account = subAccount as DomainModels.Accounts.TexasElectricityAccount;
            return account.ProductId;
        }

        string ILocationAdapter.GetUtilityAccountNumber(DomainModels.Accounts.ISubAccount subAccount)
        {
            var account = subAccount as DomainModels.Accounts.TexasElectricityAccount;
            return account.Id;
        }


        IServiceCapability ILocationAdapter.GetRenewalServiceCapability(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount)
        {
            return new StreamEnergy.DomainModels.Enrollments.TexasElectricity.RenewalCapability { Account = account, SubAccount = subAccount };
        }
    }
}
