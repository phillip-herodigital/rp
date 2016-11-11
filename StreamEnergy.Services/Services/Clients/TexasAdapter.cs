using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;
using TexasElectricity = StreamEnergy.DomainModels.Enrollments.TexasElectricity;
using StreamEnergy.DomainModels.Accounts;

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
            var capability = capabilities.OfType<TexasElectricity.ServiceCapability>();
            return (capability.Count() > 1) ? null : capability.Single().EsiId;
        }

        string ILocationAdapter.GetSystemOfRecord()
        {
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
                          where ((IEnumerable<dynamic>)product.Rates).All(r => r.Unit == "$/kwh")
                          where texasService is TexasElectricity.RenewalCapability || product.Provider["Name"].ToString() == providerName
                          group product by product.ProductCode into products
                          let product = products.First()
                          let productData = sitecoreProductData.GetTexasElectricityProductData(product.ProductCode.ToString(), product.Provider.Name.ToString())
                          where productData != null
                          let hasDisclaimer = !string.IsNullOrEmpty(productData.Fields["Disclaimer"])
                          select new TexasElectricity.Offer
                          {
                              Id = product.Provider["Name"].ToString() + "/" + product.ProductId,
                              Provider = product.Provider.ToString(),
                              Tdu =  product.Provider["Name"].ToString() ,

                              EnrollmentType = serviceStatus.EnrollmentType,

                              Name = productData.Fields["Name"],
                              Description = System.Web.HttpUtility.HtmlEncode(productData.Fields["Description"]),

                              Rate = ((IEnumerable<dynamic>)product.Rates).First(r => r.EnergyType == "Average").Value * 100,
                              StreamEnergyCharge = ((IEnumerable<dynamic>)product.Rates).First(r => r.EnergyType == "Energy").Value * 100,
                              MinimumUsageFee = productData.Fields["Minimum Usage Fee"],
                              TduCharges = productData.Fields["TDU Charges"],
                              TermMonths = product.Term,
                              RateType = ((IEnumerable<dynamic>)product.Rates).Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              TerminationFee = ((IEnumerable<dynamic>)product.Fees).Where(fee => fee.Name == "Early Termination Fee").Select(fee => fee.Amount).FirstOrDefault(),
                              IncludesThermostat = !string.IsNullOrEmpty(productData.Fields["Includes Thermostat"]),
                              ThermostatDescription = productData.Fields["Thermostat Description"],
                              IncludesSkydrop = !string.IsNullOrEmpty(productData.Fields["Includes Skydrop"]),
                              SkydropDescription = productData.Fields["Skydrop Description"],
                              IncludesPromo = !string.IsNullOrEmpty(productData.Fields["Includes Promo"]),
                              PromoIcon = productData.Fields["Promo Icon"],
                              PromoDescription = productData.Fields["Promo Description"],
                              IncludesSkybell = !string.IsNullOrEmpty(productData.Fields["Includes Skybell"]),
                              SkybellColor = productData.Fields["Skybell Color"],
                              SkybellDescription = productData.Fields["Skybell Description"],
                              AssociatedPlanID = productData.Fields["Associated PlanID"],
                              HidePlan = !string.IsNullOrEmpty(productData.Fields["Hide Plan"]),
                              IsDisabled = !string.IsNullOrEmpty(productData.Fields["Is Disabled"]),

                              Footnotes = productData.Footnotes,

                              Documents = hasDisclaimer ? new Dictionary<string, Uri>
                              {
                                  { "ElectricityFactsLabel", new Uri(productData.Fields["Energy Facts Label"], UriKind.Relative) },
                                  { "TermsOfService", new Uri(productData.Fields["Terms Of Service"], UriKind.Relative) },
                                  { "Disclaimer", new Uri(productData.Fields["Disclaimer"], UriKind.Relative) },
                                  { "YourRightsAsACustomer", new Uri(productData.Fields["Your Rights As A Customer"], UriKind.Relative) },
                              } : new Dictionary<string, Uri>
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



        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account, bool IsAutoPayEnabled, string ExistingAccountNumber, DateTime DOB, string Gender)
        {
            var texasElectricityOffer = account.Offer.Offer as TexasElectricity.Offer;
            var texasService = account.Location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
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
                    SelectedMoveInDate = (account.Offer.OfferOption is TexasElectricity.MoveInOfferOption) ? ((TexasElectricity.MoveInOfferOption)account.Offer.OfferOption).ConnectDate : DateTime.Now,
                    UtilityProvider = JObject.Parse(texasElectricityOffer.Provider),
                    UtilityAccountNumber = texasService.EsiId,
                    Product = new
                    {
                        ProductId = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1],
                        ProductCode = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1],
                        Term = texasElectricityOffer.TermMonths
                    },
                    ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(account.Location.Address),
                    ProductType = "Electricity",
                    Deposit = StreamConnectUtilities.ToStreamConnectDeposit(account.OfferPayments, account.Offer.WaiveDeposit),
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
                var productData = sitecoreProductData.GetTexasElectricityProductData((string)details.Product.ProductCode, null) ?? new SitecoreProductInfo
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

                result.IncludesThermostat = IncludesThemostat(result.ProductId);
                result.IncludesSkydrop = IncludesSkydrop(result.ProductId);
                result.IncludesPromo = IncludesPromo(result.ProductId);

                result.CustomerType = (details.CustomerType == "Residential") ? EnrollmentCustomerType.Residential : EnrollmentCustomerType.Commercial;
            }
            return result;
        }

        private bool IncludesThemostat(string productId)
        {
            List<Sitecore.Data.Items.Item> products = Sitecore.Context.Database.GetItem("{59E32706-A8B5-4E47-9918-D3DE64E2C7F8}").Children.ToList(); // /sitecore/content/Data/Taxonomy/Products/Texas
            Sitecore.Data.Items.Item product = products.FirstOrDefault(a => a.Name == productId);

            return product != null ? !string.IsNullOrEmpty(product.Fields["Includes Thermostat"].Value) : false;

            //return products.Any(a => a.Fields != null && a.Name == productName && !string.IsNullOrEmpty(a.Fields["Includes Thermostat"].Value));
        }

        private bool IncludesSkydrop(string productId)
        {
            List<Sitecore.Data.Items.Item> products = Sitecore.Context.Database.GetItem("{59E32706-A8B5-4E47-9918-D3DE64E2C7F8}").Children.ToList(); // /sitecore/content/Data/Taxonomy/Products/Texas
            Sitecore.Data.Items.Item product = products.FirstOrDefault(a => a.Name == productId);
 
            return product != null ? !string.IsNullOrEmpty(product.Fields["Includes Skydrop"].Value) : false;
        }

        private bool IncludesPromo(string productId)
        {
            List<Sitecore.Data.Items.Item> products = Sitecore.Context.Database.GetItem("{59E32706-A8B5-4E47-9918-D3DE64E2C7F8}").Children.ToList(); // /sitecore/content/Data/Taxonomy/Products/Texas
            Sitecore.Data.Items.Item product = products.FirstOrDefault(a => a.Name == productId);

            return product != null ? !string.IsNullOrEmpty(product.Fields["Includes Promo"].Value) : false;
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
            return new StreamEnergy.DomainModels.Enrollments.TexasElectricity.RenewalCapability { Account = account, SubAccount = subAccount, Tdu = "NA" };
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
            decimal depositAlternative = 0;
            bool depositAlternativeEligible = false;
            // Load the deposit even if KIQ fails
            if (entry.Premise.Deposit != null)
                deposit = (decimal)entry.Premise.Deposit.Amount.Value;
            // Uncomment the below lines to turn Deposit Alternative back on
            if (entry.Premise.DepositAlternative != null)
            {
                depositAlternative = (decimal)entry.Premise.DepositAlternative.DepositAlternativeAmount.Value;
                depositAlternativeEligible = (bool)entry.Premise.DepositAlternative.DepositAlternativeEligible.Value;
            }
                
            return new OfferPayment
                    {
                        EnrollmentAccountNumber = entry.EnrollmentAccountNumber,
                        OngoingAmounts = new IOfferPaymentAmount[] 
                        {
                        },
                        RequiredAmounts = new IOfferPaymentAmount[] 
                        {
                            new DepositOfferPaymentAmount { DollarAmount = deposit, SystemOfRecord = entry.Key.SystemOfRecord, DepositAccount = entry.Key.SystemOfRecordId, DepositAlternativeEligible = depositAlternativeEligible, DepositAlternativeAmount = depositAlternative }
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
            var texasElectricityOffer = offer as TexasElectricity.Offer;
            id = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1];
            code = texasElectricityOffer.Id.Split(new[] { '/' }, 2)[1];
        }
    }
}
