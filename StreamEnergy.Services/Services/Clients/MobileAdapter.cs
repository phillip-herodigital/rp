using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Mobile = StreamEnergy.DomainModels.Enrollments.Mobile;

namespace StreamEnergy.Services.Clients
{
    class MobileAdapter : ILocationAdapter
    {
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

        string ILocationAdapter.GetSystemOfRecord(IEnumerable<DomainModels.IServiceCapability> capabilities)
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
            var mockProducts = new StreamConnect.Product[] 
                {
                    new StreamConnect.Product
                    {
                        ProductId = "111",
                        Provider = "ATT",
                        ProductCode = "1GB"
                    },
                    new StreamConnect.Product
                    {
                        ProductId = "222",
                        Provider = "ATT",
                        ProductCode = "2GB"
                    },
                    new StreamConnect.Product
                    {
                        ProductId = "333",
                        Provider = "ATT",
                        ProductCode = "3GB"
                    }

                };
            
            return new DomainModels.Enrollments.LocationOfferSet
            {
                Offers = (from product in mockProducts //streamConnectProductResponse.Products
                          //where product.Rates.Any(r => r.Unit == "Therm")
                          //group product by product.ProductCode into products
                          //let product = products.First()
                          //let productData = sitecoreProductData.GetGeorgiaGasProductData(product.ProductCode)
                          //where productData != null
                          select new Mobile.Offer
                          {
                              Id = product.ProductId,
                              Provider = product.Provider.ToString(),
                              Code = product.ProductCode,
                              Product = Newtonsoft.Json.JsonConvert.SerializeObject(product),

                              //EnrollmentType = serviceStatus.EnrollmentType,

                              //Name = productData.Fields["Name"],
                              //Description = productData.Fields["Description"],

                              //Rate = product.Rates.First(r => r.EnergyType == "Average").Value,
                              //TermMonths = product.Term,
                              //RateType = product.Rates.Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              //CancellationFee = productData.Fields["Early Termination Fee"],
                              //MonthlyServiceCharge = productData.Fields["Monthly Service Charge"],

                              //Footnotes = productData.Footnotes,

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

        dynamic ILocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, DomainModels.Enrollments.UserContext context, DomainModels.Enrollments.LocationServices service, DomainModels.Enrollments.SelectedOffer offer, Newtonsoft.Json.Linq.JObject salesInfo, Guid? enrollmentAccountId, object depositObject)
        {
            throw new NotImplementedException();
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

        object ILocationAdapter.GetProductRequest(DomainModels.Enrollments.Location location)
        {
            return new
            {
                ServiceType = "Mobile",
                Network = location.Capabilities.OfType<Mobile.ServiceCapability>().Single().ServiceProvider.ToString("g"),
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
            };
        }
    }
}
