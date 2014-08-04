using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using System.Net.Http;

namespace StreamEnergy.Services.Clients
{
    class EnrollmentService : IEnrollmentService
    {
        private HttpClient streamConnectClient;

        public EnrollmentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client)
        {
            this.streamConnectClient = client;
        }

        async Task<Dictionary<Location, LocationOfferSet>> IEnrollmentService.LoadOffers(IEnumerable<Location> serviceLocations)
        {
            Dictionary<Location, LocationOfferSet> result = new Dictionary<Location,LocationOfferSet>();
            foreach (var location in serviceLocations.Distinct())
            {
                if (location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Any())
                    result.Add(location, await LoadTexasOffers(location));
                else
                {
                    // Not implemented!
                }
            }
            return result;
        }

        private async Task<LocationOfferSet> LoadTexasOffers(Location location)
        {
            if (location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Count() != 1)
            {
                return new LocationOfferSet { OfferSetErrors = { { "TexasElectricity", "MultipleTdu" } } };
            }
            else if (location.Capabilities.OfType<DomainModels.Enrollments.ServiceStatusCapability>().Count() != 1)
            {
                return new LocationOfferSet { OfferSetErrors = { { "TexasElectricity", "ServiceStatusUnknown" } } };
            }

            var texasService = location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Single();
            var serviceStatus = location.Capabilities.OfType<DomainModels.Enrollments.ServiceStatusCapability>().Single();

            // Grab from the HttpUtility because it creates the interna `HttpValueCollection`, which will escape values properly when ToString'd.
            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["CustomerType"] = "Residential"; // TODO - commercial? How are we passing that?
            parameters["EnrollmentType"] = serviceStatus.IsNewService ? "MoveIn" : "Switch"; // TODO - renewal? How are we doing that?
            parameters["ServiceAddress.City"] = location.Address.City;
            parameters["ServiceAddress.State"] = location.Address.StateAbbreviation;
            parameters["ServiceAddress.StreetLine1"] = location.Address.Line1;
            parameters["ServiceAddress.StreetLine2"] = location.Address.Line2;
            parameters["ServiceAddress.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = texasService.EsiId;
            parameters["SystemOfRecord"] = "CIS1";

            var response = await streamConnectClient.GetAsync("/api/products?" + parameters.ToString());

            var streamConnectProducts = Json.Read<IEnumerable<StreamConnect.Product>>(await response.Content.ReadAsStringAsync());

            return new LocationOfferSet
            {
                Offers = (from product in streamConnectProducts
                          // Only supporting $/kwh for Texas enrollments, at least for now. Making sure that our `* 100` below doesn't cause a bug...
                          where product.Rate.Unit == "$/kwh"
                          group product by product.ProductCode into products
                          let product = products.First()
                          select new TexasElectricityOffer
                          {
                              Id = product.ProductCode,
                              Provider = product.Provider.ToString(),

                              IsNewService = serviceStatus.IsNewService,

                              // TODO - link with Sitecore
                              Name = product.Name,
                              Description = product.Description,

                              Rate = product.Rate.Value * 100,
                              TermMonths = product.Term,
                              RateType = product.Rate.Type == "Fixed" ? RateType.Fixed : RateType.Variable,
                              // TODO
                              CancellationFee = 0,
                              // TODO
                              Documents = new Dictionary<string, Uri> 
                              {
                                  { "ElectricityFactsLabel", new Uri("/", UriKind.Relative) },
                                  { "TermsOfService", new Uri("/", UriKind.Relative) },
                                  { "YourRightsAsACustomer", new Uri("/", UriKind.Relative) },
                              }
                          }).ToArray()
            };
        }

        async Task<IConnectDatePolicy> IEnrollmentService.LoadConnectDates(Location location)
        {
            if (location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Any())
                return await LoadTexasConnectDates(location);
            else
                throw new NotImplementedException();
        }

        private async Task<IConnectDatePolicy> LoadTexasConnectDates(Location location)
        {
            var texasService = location.Capabilities.OfType<DomainModels.TexasServiceCapability>().Single();

            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["Address.City"] = location.Address.City;
            parameters["Address.State"] = location.Address.StateAbbreviation;
            parameters["Address.StreetLine1"] = location.Address.Line1;
            parameters["Address.StreetLine2"] = location.Address.Line2;
            parameters["Address.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = texasService.EsiId;
            parameters["SystemOfRecord"] = "CIS1";

            var response = await streamConnectClient.GetAsync("/api/MoveInDates?" + parameters);

            var result = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            //{"MoveInDates":[{"Date":"2014-08-04T00:00:00","Priority":true,"Fees":[{"Name":"Move In Date Fee","Amount":79.27}]}...]}

            return new ConnectDatePolicy()
            {
                AvailableConnectDates = (from entry in result["MoveInDates"].ToObject<IEnumerable<StreamConnect.MoveInDate>>()
                                         select new ConnectDate
                                         {
                                             Date = entry.Date,
                                             Classification = entry.Priority ? ConnectDateClassification.Priority : ConnectDateClassification.Standard,
                                             Fees = entry.Fees.ToDictionary(fee => ToFeeQualifier(feeName: fee.Name), fee => fee.Amount)
                                         }).ToArray()
            };
        }

        private string ToFeeQualifier(string feeName)
        {
            switch (feeName)
            {
                case "Move In Date Fee":
                    return "ConnectFee";
                default:
                    throw new NotImplementedException();
            }
        }

        DomainModels.Enrollments.Service.IdentityCheckResult IEnrollmentService.IdentityCheck(DomainModels.Name name, string ssn, DomainModels.DriversLicense driversLicense, AdditionalIdentityInformation identityInformation)
        {
            if (identityInformation == null)
            {
                return new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityAccepted = false,
                    HardStop = null,
                    IdentityCheckId = "01234",
                    IdentityQuestions = new[] 
                    {
                        new IdentityQuestion
                        {
                            QuestionId = "1",
                            QuestionText = "What is your name?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "King Arthur" },
                                new IdentityAnswer { AnswerId = "2", AnswerText = "Sir Lancelot" },
                                new IdentityAnswer { AnswerId = "3", AnswerText = "Sir Robin" },
                                new IdentityAnswer { AnswerId = "4", AnswerText = "Sir Galahad" },
                            }
                        },
                        new IdentityQuestion
                        {
                            QuestionId = "2",
                            QuestionText = "What is your quest?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "To seek the Holy Grail." },
                            }
                        },
                        new IdentityQuestion
                        {
                            QuestionId = "3",
                            QuestionText = "What is your favorite color?",
                            Answers = new[] { 
                                new IdentityAnswer { AnswerId = "1", AnswerText = "Blue." },
                                new IdentityAnswer { AnswerId = "2", AnswerText = "Green." },
                                new IdentityAnswer { AnswerId = "3", AnswerText = "Yellow." },
                                new IdentityAnswer { AnswerId = "4", AnswerText = "Red." },
                            }
                        },
                    }
                };
            }
            else
            {
                return new DomainModels.Enrollments.Service.IdentityCheckResult
                {
                    IdentityCheckId = "01235",
                    IdentityAccepted = true,
                    HardStop = null,
                    IdentityQuestions = new IdentityQuestion[0],
                };
            }
        }

        IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>> IEnrollmentService.LoadOfferPayments(IEnumerable<LocationServices> services)
        {
            return (from loc in services
                    from offer in loc.SelectedOffers
                    select new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.OfferPayment>
                    {
                        Location = loc.Location,
                        Offer = offer.Offer,
                        Details = new DomainModels.Enrollments.OfferPayment
                        {
                            RequiredAmounts = new IOfferPaymentAmount[] 
                            { 
                                new DepositOfferPaymentAmount { DollarAmount = (offer.Offer is TexasElectricityOffer && ((TexasElectricityOffer)offer.Offer).TermMonths == 1) ? 0 : 75.25m }
                            },
                            OngoingAmounts = new IOfferPaymentAmount[] { }
                        }
                    }).ToArray();
        }

        IEnumerable<DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>> IEnrollmentService.PlaceOrder(IEnumerable<LocationServices> services)
        {

            return (from loc in services
                    from offer in loc.SelectedOffers
                    select new DomainModels.Enrollments.Service.LocationOfferDetails<DomainModels.Enrollments.Service.PlaceOrderResult>
                    {
                        Location = loc.Location,
                        Offer = offer.Offer,
                        Details = new DomainModels.Enrollments.Service.PlaceOrderResult { ConfirmationNumber = "87654321" }
                    }).ToArray();
        }

    }
}
