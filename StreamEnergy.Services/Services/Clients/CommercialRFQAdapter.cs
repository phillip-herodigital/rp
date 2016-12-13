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
    class CommercialRFQAdapter : ILocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public CommercialRFQAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }

        bool ILocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.OfType<TexasElectricity.ServiceCapability>().Any() && capabilities.OfType<CustomerTypeCapability>().Any(cap => cap.CustomerType == EnrollmentCustomerType.Commercial);
        }

        bool ILocationAdapter.IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer)
        {
            return offer.OfferType == TexasElectricity.CommercialQuote.Qualifier;
        }

        bool ILocationAdapter.IsFor(Address serviceAddress, string productType)
        {
            return false;
        }

        bool ILocationAdapter.IsFor(DomainModels.Accounts.ISubAccount subAccount)
        {
            return false;
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
            return "CommercialRFQ";
        }

        string ILocationAdapter.GetCommodityType()
        {
            return "Electricity";
        }


        DomainModels.Enrollments.LocationOfferSet ILocationAdapter.LoadOffers(DomainModels.Enrollments.Location location, StreamConnect.ProductResponse streamConnectProductResponse)
        {
            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();
            return new LocationOfferSet
            {
                Offers = new[] {
                        new TexasElectricity.CommercialQuote { }
                    }
            };
        }
     
        bool ILocationAdapter.SkipPremiseVerification(Location location)
        {
            var capability = location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            return capability.EsiId == null;
        }



        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, EnrollmentAccountDetails account, bool IsAutoPayEnabled, string ExistingAccountNumber, DateTime DOB, string Gender)
        {
            var texasService = account.Location.Capabilities.OfType<TexasElectricity.ServiceCapability>().Single();
            var serviceStatus = account.Location.Capabilities.OfType<ServiceStatusCapability>().Single();
            var customerType = account.Location.Capabilities.OfType<CustomerTypeCapability>().Single();

            return new
            {
                ServiceType = "CommercialUtility",
                Key = account.EnrollmentAccountKey,
                RequestUniqueKey = account.RequestUniqueKey,
                Premise = new
                {
                    EnrollmentType = serviceStatus.EnrollmentType.ToString("g"),
                    SelectedMoveInDate = (account.Offer.OfferOption is TexasElectricity.CommercialQuoteOption) ? ((TexasElectricity.CommercialQuoteOption)account.Offer.OfferOption).ConnectDate : DateTime.Now,
                    UtilityProvider = new
                    {
                        Id = "",
                        Name = texasService.Tdu,
                    },
                    UtilityAccountNumber = texasService.EsiId,
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
            throw new NotImplementedException();
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
            return false;
        }


        void ILocationAdapter.GetRenewalValues(IOffer offer, out string code, out string id)
        {
            throw new NotImplementedException();
        }
    }
}
