﻿using System;
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
    class GeorgiaEnrollmentAdapter : IEnrollmentLocationAdapter
    {
        private readonly ISitecoreProductData sitecoreProductData;

        public GeorgiaEnrollmentAdapter(ISitecoreProductData sitecoreProductData)
        {
            this.sitecoreProductData = sitecoreProductData;
        }

        bool IEnrollmentLocationAdapter.IsFor(IEnumerable<DomainModels.IServiceCapability> capabilities)
        {
            return capabilities.OfType<GeorgiaGas.ServiceCapability>().Any();            
        }

        bool IEnrollmentLocationAdapter.IsFor(IEnumerable<IServiceCapability> capabilities, IOffer offer)
        {
            return offer.OfferType == GeorgiaGas.Offer.Qualifier;
        }

        string IEnrollmentLocationAdapter.GetUtilityAccountNumber(IEnumerable<IServiceCapability> capabilities)
        {
            var capability = capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            return capability.AglAccountNumber;
        }

        string IEnrollmentLocationAdapter.GetSystemOfRecord(IEnumerable<IServiceCapability> capabilities)
        {
            return "ISTA";
        }

        string IEnrollmentLocationAdapter.GetCommodityType()
        {
            return "Gas";
        }

        DomainModels.Enrollments.LocationOfferSet IEnrollmentLocationAdapter.LoadOffers(DomainModels.Enrollments.Location location, StreamConnect.ProductResponse streamConnectProductResponse)
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
                          where product.Rates.Any(r => r.Unit == "Therm")
                          group product by product.ProductCode into products
                          let product = products.First()
                          let productData = sitecoreProductData.GetGeorgiaGasProductData(product)
                          where productData != null
                          select new GeorgiaGas.Offer
                          {
                              Id = product.Provider["Name"].ToString() + "/" + product.ProductCode,
                              Provider = product.Provider.ToString(),

                              EnrollmentType = serviceStatus.EnrollmentType,

                              Name = productData.Fields["Name"],
                              Description = productData.Fields["Description"],

                              Rate = product.Rates.First(r => r.EnergyType == "Average").Value * 100,
                              TermMonths = product.Term,
                              RateType = product.Rates.Any(r => r.Type == "Fixed") ? RateType.Fixed : RateType.Variable,
                              CancellationFee = product.Fees.Where(fee => fee.Name == "Early Termination Fee").Select(fee => fee.Amount).FirstOrDefault(),

                              Footnotes = productData.Footnotes,

                              Documents = new Dictionary<string, Uri>
                              {
                                  // TODO
                              }
                          }).ToArray()
            };
        }



        bool IEnrollmentLocationAdapter.SkipPremiseVerification(Location location)
        {
            var capability = location.Capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            return capability.AglAccountNumber == null;
        }

        dynamic IEnrollmentLocationAdapter.ToEnrollmentAccount(Guid globalCustomerId, UserContext context, LocationServices service, SelectedOffer offer, Newtonsoft.Json.Linq.JObject salesInfo, Guid? enrollmentAccountId, object depositObject)
        {
            var georgiaGasOffer = offer.Offer as GeorgiaGas.Offer;
            var georgiaGasService = service.Location.Capabilities.OfType<GeorgiaGas.ServiceCapability>().Single();
            var serviceStatus = service.Location.Capabilities.OfType<ServiceStatusCapability>().Single();
            var customerType = service.Location.Capabilities.OfType<CustomerTypeCapability>().Single();

            return new
            {
                GlobalCustomerId = globalCustomerId.ToString(),
                SalesInfo = salesInfo,
                CustomerType = customerType.CustomerType.ToString("g"),
                EnrollmentAccountId = enrollmentAccountId ?? Guid.Empty,
                SystemOfRecord = "CIS1",
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
                    SelectedMoveInDate = (offer.OfferOption is GeorgiaGas.MoveInOfferOption) ? ((GeorgiaGas.MoveInOfferOption)offer.OfferOption).ConnectDate : DateTime.Now,
                    UtilityProvider = JObject.Parse(georgiaGasOffer.Provider),
                    UtilityAccountNumber = georgiaGasService.AglAccountNumber,
                    Product = new
                    {
                        ProductCode = georgiaGasOffer.Id.Split(new[] { '/' }, 2)[1],
                        Term = georgiaGasOffer.TermMonths
                    },
                    ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(service.Location.Address),
                    ProductType = "Electricity",
                    Deposit = depositObject
                }
            };
        }
    }
}
