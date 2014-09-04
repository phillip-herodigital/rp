using StreamEnergy.DomainModels.Enrollments;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using System.Net.Http;
using Newtonsoft.Json.Linq;
using StreamEnergy.DomainModels.Enrollments.Service;
using StreamEnergy.DomainModels;

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
            Dictionary<Location, LocationOfferSet> result = new Dictionary<Location, LocationOfferSet>();
            foreach (var location in serviceLocations.Distinct())
            {
                if (location.Capabilities.OfType<ServiceStatusCapability>().Count() != 1)
                {
                    result.Add(location, new LocationOfferSet { OfferSetErrors = { { "Location", "ServiceStatusUnknown" } } });
                    continue;
                }
                else if (location.Capabilities.OfType<CustomerTypeCapability>().Count() != 1)
                {
                    result.Add(location, new LocationOfferSet { OfferSetErrors = { { "Location", "CustomerTypeUnknown" } } });
                    continue;
                }

                var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();
                var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();

                if (location.Capabilities.OfType<TexasServiceCapability>().Any())
                {
                    if (customerType.CustomerType == EnrollmentCustomerType.Residential)
                    {
                        result.Add(location, await LoadTexasOffers(location, serviceStatus, customerType));
                    }
                    else
                    {
                        result.Add(location, new LocationOfferSet { Offers = new[] {
                            new TexasElectricityCommercialQuote { }
                        } });
                    }
                }
                else
                {
                    // Not implemented!
                }
            }
            return result;
        }

        private async Task<LocationOfferSet> LoadTexasOffers(Location location, ServiceStatusCapability serviceStatus, CustomerTypeCapability customerType)
        {
            if (location.Capabilities.OfType<TexasServiceCapability>().Count() != 1)
            {
                return new LocationOfferSet { OfferSetErrors = { { "TexasElectricity", "MultipleTdu" } } };
            }

            var texasService = location.Capabilities.OfType<TexasServiceCapability>().Single();

            // Grab from the HttpUtility because it creates the interna `HttpValueCollection`, which will escape values properly when ToString'd.
            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["CustomerType"] = customerType.CustomerType.ToString("g");
            parameters["EnrollmentType"] = serviceStatus.EnrollmentType.ToString("g");
            parameters["ServiceAddress.City"] = location.Address.City;
            parameters["ServiceAddress.State"] = location.Address.StateAbbreviation;
            parameters["ServiceAddress.StreetLine1"] = location.Address.Line1;
            parameters["ServiceAddress.StreetLine2"] = location.Address.Line2;
            parameters["ServiceAddress.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = texasService.EsiId;
            parameters["SystemOfRecord"] = "CIS1";

            var response = await streamConnectClient.GetAsync("/api/products?" + parameters.ToString());

            response.EnsureSuccessStatusCode();
            var streamConnectProductResponse = Json.Read<StreamConnect.ProductResponse>(await response.Content.ReadAsStringAsync());

            return new LocationOfferSet
            {
                Offers = (from product in streamConnectProductResponse.Products
                          // Only supporting $/kwh for Texas enrollments, at least for now. Making sure that our `* 100` below doesn't cause a bug...
                          where product.Rate.Unit == "$/kwh"
                          group product by product.ProductCode into products
                          let product = products.First()
                          select new TexasElectricityOffer
                          {
                              Id = product.ProductCode,
                              Provider = product.Provider.ToString(),

                              EnrollmentType = serviceStatus.EnrollmentType,

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

        async Task<PremiseVerificationResult> IEnrollmentService.VerifyPremise(Location location)
        {
            var texasService = location.Capabilities.OfType<TexasServiceCapability>().SingleOrDefault();
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();
            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();

            if (texasService != null && texasService.EsiId == null)
                return PremiseVerificationResult.Success;
            
            var response = await streamConnectClient.PostAsJsonAsync("/api/Enrollments/VerifyPremise", new
            {
                ServiceAddress = ToStreamConnectAddress(location.Address),
                UtilityAccountNumber = texasService != null ? texasService.EsiId : null,
                CustomerType = customerType.CustomerType.ToString("g"),
                EnrollmentType = serviceStatus.EnrollmentType.ToString("g")
            });

            response.EnsureSuccessStatusCode();

            var result = Json.Read<StreamConnect.VerifyPremiseResponse>(await response.Content.ReadAsStringAsync());
            if (result.IsEligibleField)
                return PremiseVerificationResult.Success;

            if (result.FailureReason != null)
            {
                if (result.FailureReason.Contains("Esiid is already active.  Switch is not allowed."))
                    return PremiseVerificationResult.MustMoveIn;
            }
            return PremiseVerificationResult.GeneralError;
        }

        async Task<IConnectDatePolicy> IEnrollmentService.LoadConnectDates(Location location)
        {
            if (location.Capabilities.OfType<TexasServiceCapability>().Any())
                return await LoadTexasConnectDates(location);
            else
                throw new NotImplementedException();
        }

        private async Task<IConnectDatePolicy> LoadTexasConnectDates(Location location)
        {
            var texasService = location.Capabilities.OfType<TexasServiceCapability>().Single();

            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["Address.City"] = location.Address.City;
            parameters["Address.State"] = location.Address.StateAbbreviation;
            parameters["Address.StreetLine1"] = location.Address.Line1;
            parameters["Address.StreetLine2"] = location.Address.Line2;
            parameters["Address.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = texasService.EsiId;
            parameters["SystemOfRecord"] = "CIS1";

            var response = await streamConnectClient.GetAsync("/api/MoveInDates?" + parameters);
            response.EnsureSuccessStatusCode();

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
        Task<bool> IEnrollmentService.IsBlockedSocialSecurityNumber(string ssn)
        {
            if (ssn == "000000000")
                return Task.FromResult(true);
            return Task.FromResult(false);
        }


        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.BeginSaveEnrollment(Guid globalCustomerId, UserContext context)
        {
            var request = (from service in context.Services
                           from offer in service.SelectedOffers
                           select ToEnrollmentAccount(globalCustomerId, context, service, offer)).ToArray();
            var response = await streamConnectClient.PostAsJsonAsync("/api/customers/" + globalCustomerId.ToString() + "/enrollments", request);
            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<EnrollmentSaveResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }

        private dynamic ToEnrollmentAccount(Guid globalCustomerId, UserContext context, LocationServices service, SelectedOffer offer, Guid? enrollmentAccountId = null)
        {
            switch (offer.Offer.OfferType)
            {
                case TexasElectricityOffer.Qualifier:
                    var texasElectricityOffer = offer.Offer as TexasElectricityOffer;
                    var texasService = service.Location.Capabilities.OfType<TexasServiceCapability>().Single();
                    var serviceStatus = service.Location.Capabilities.OfType<ServiceStatusCapability>().Single();
                    var customerType = service.Location.Capabilities.OfType<CustomerTypeCapability>().Single();
                    return new
                    {
                        GlobalCustomerId = globalCustomerId.ToString(),
                        CustomerType = customerType.CustomerType.ToString("g"),
                        EnrollmentAccountId = enrollmentAccountId,
                        SystemOfRecord = "CIS1",
                        FirstName = context.ContactInfo.Name.First,
                        LastName = context.ContactInfo.Name.Last,
                        BillingAddress = ToStreamConnectAddress(context.MailingAddress),
                        HomePhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Home).Select(p => p.Number).SingleOrDefault(),
                        CellPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Mobile).Select(p => p.Number).SingleOrDefault(),
                        WorkPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Work).Select(p => p.Number).SingleOrDefault(),
                        SSN = context.SocialSecurityNumber,
                        EmailAddress = context.ContactInfo.Email.Address,
                        Premise = new
                        {
                            EnrollmentType = serviceStatus.EnrollmentType.ToString("g"),
                            SelectedMoveInDate = (offer.OfferOption is TexasElectricityMoveInOfferOption) ? ((TexasElectricityMoveInOfferOption)offer.OfferOption).ConnectDate : DateTime.Now,
                            UtilityProvider = JObject.Parse(texasElectricityOffer.Provider),
                            UtilityAccountNumber = texasService.EsiId,
                            Product = new
                            {
                                ProductCode = texasElectricityOffer.Id,
                                Term = texasElectricityOffer.TermMonths
                            },
                            ServiceAddress = ToStreamConnectAddress(service.Location.Address),
                            ProductType = "Electricity"
                        }
                    };
                default:
                    throw new NotImplementedException();
            }
        }

        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.EndSaveEnrollment(StreamAsync<EnrollmentSaveResult> asyncResult, UserContext context)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }


            asyncResult.IsCompleted = true;

            var responseObject = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            if ((string)responseObject["Status"] == "Success")
            {
                var enrollmentResponses = responseObject["EnrollmentResponses"].ToObject<IEnumerable<StreamConnect.CreateOrUpdateEnrollmentResponse>>();

                asyncResult.Data = new EnrollmentSaveResult
                    {
                        Results = (from entry in enrollmentResponses
                                   select new EnrollmentSaveEntry
                                   {
                                       CisAccountNumber = entry.CisAccountNumber,
                                       StreamReferenceNumber = entry.StreamReferenceNumber,
                                       GlobalEnrollmentAccountId = entry.GlobalEnrollmentAccountId,
                                   })
                                   .Zip(from service in context.Services
                                        from offer in service.SelectedOffers
                                        select new { service, offer }, (enrollResult, serviceOffer) =>
                                        new LocationOfferDetails<EnrollmentSaveEntry>
                                        {
                                            Details = enrollResult,
                                            Location = serviceOffer.service.Location,
                                            Offer = serviceOffer.offer.Offer
                                        }).ToArray()
                    };
            }

            return asyncResult;
        }

        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.UpdateEnrollment(Guid globalCustomerId, EnrollmentSaveResult enrollmentSaveResult, UserContext context)
        {
            var request = (from service in context.Services
                           from offer in service.SelectedOffers
                           join previousSave in enrollmentSaveResult.Results on new { offer.Offer.Id, service.Location } equals new { previousSave.Offer.Id, previousSave.Location }
                           select ToEnrollmentAccount(globalCustomerId, context, service, offer, previousSave.Details.GlobalEnrollmentAccountId)).ToArray();
            var response = await streamConnectClient.PutAsJsonAsync("/api/customers/" + globalCustomerId.ToString() + "/enrollments", request);
            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<EnrollmentSaveResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }


        async Task<StreamAsync<IdentityCheckResult>> IEnrollmentService.BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation)
        {
            if (identityInformation == null)
            {
                var response = await streamConnectClient.PostAsJsonAsync("/api/verifications/id/" + streamCustomerId.ToString(), new
                {
                    FirstName = name.First,
                    LastName = name.Last,
                    SSN = ssn,
                    Address = ToStreamConnectAddress(mailingAddress)
                });
                response.EnsureSuccessStatusCode();
                var responseString = await response.Content.ReadAsStringAsync();
                var result = Json.Read<StreamConnect.IdVerificationChallengeResponse>(responseString);

                if (result.Status != "Success")
                {
                    // TODO - this block is probably wrong, but I don't know that for certain.
                    return new StreamAsync<IdentityCheckResult>
                    {
                        IsCompleted = true,
                        Data = new IdentityCheckResult { IdentityAccepted = true, IdentityQuestions = new IdentityQuestion[0], HardStop = null }
                    };
                }

                return new StreamAsync<IdentityCheckResult>
                {
                    IsCompleted = true,
                    Data = new IdentityCheckResult
                    {
                        HardStop = null,
                        IdentityCheckId = result.IdVerificationChallenge.CreditServiceSessionId,
                        IdentityAccepted = false,
                        IdentityQuestions = (from question in result.IdVerificationChallenge.Questions
                                             select new IdentityQuestion
                                             {
                                                 QuestionId = question.Index.ToString(),
                                                 QuestionText = question.QuestionText,
                                                 Answers = (from answer in question.Answers
                                                            select new IdentityAnswer
                                                            {
                                                                AnswerId = answer.Index.ToString(),
                                                                AnswerText = answer.AnswerText
                                                            }).ToArray()
                                             }).ToArray()
                    }
                };
            }
            else
            {
                var response = await streamConnectClient.PutAsJsonAsync("/api/verifications/id/" + streamCustomerId.ToString(), new
                {
                    CreditServiceSessionId = identityInformation.PreviousIdentityCheckId,
                    Questions = (from question in identityInformation.SelectedAnswers
                                 select new
                                 {
                                     Index = int.Parse(question.Key),
                                     SelectedAnswerIndex = int.Parse(question.Value)
                                 }).ToArray()
                });
                response.EnsureSuccessStatusCode();
                
                var asyncUrl = response.Headers.Location;
                return new StreamAsync<IdentityCheckResult>
                {
                    IsCompleted = false,
                    ResponseLocation = asyncUrl 
                };
            }
        }

        async Task<StreamAsync<IdentityCheckResult>> IEnrollmentService.EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }
            var responseString = await response.Content.ReadAsStringAsync();

            // TODO - do something with the response? 

            asyncResult.IsCompleted = true;
            asyncResult.Data = new IdentityCheckResult { IdentityAccepted = true, IdentityQuestions = new IdentityQuestion[0] };
            return asyncResult;
        }

        async Task<StreamAsync<CreditCheckResult>> IEnrollmentService.BeginCreditCheck(Guid streamCustomerId, Name name, string ssn, Address address)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/verifications/credit/" + streamCustomerId.ToString(), new
            {
                FirstName = name.First,
                LastName = name.Last,
                SSN = ssn,
                Address = ToStreamConnectAddress(address)
            });

            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<CreditCheckResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }

        async Task<StreamAsync<CreditCheckResult>> IEnrollmentService.EndCreditCheck(StreamAsync<CreditCheckResult> asyncResult)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }
            var responseString = await response.Content.ReadAsStringAsync();

            // TODO - do something with the response? 

            asyncResult.IsCompleted = true;
            asyncResult.Data = new CreditCheckResult { };
            return asyncResult;
        }

        Task<IEnumerable<LocationOfferDetails<OfferPayment>>> IEnrollmentService.LoadOfferPayments(Guid streamCustomerId, EnrollmentSaveResult streamAsync, IEnumerable<LocationServices> services)
        {
            // TODO - actual deposit amounts rather than hard-coded values
            return Task.FromResult(from loc in services
                                   from offer in loc.SelectedOffers
                                   select new LocationOfferDetails<OfferPayment>
                                   {
                                       Location = loc.Location,
                                       Offer = offer.Offer,
                                       Details = new OfferPayment
                                       {
                                           RequiredAmounts = new IOfferPaymentAmount[] 
                                           { 
                                               new DepositOfferPaymentAmount { DollarAmount = (offer.Offer is TexasElectricityOffer && ((TexasElectricityOffer)offer.Offer).TermMonths == 1) ? 0 : 75.25m }
                                           },
                                           OngoingAmounts = new IOfferPaymentAmount[] { }
                                       }
                                   });
        }

        async Task<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> IEnrollmentService.PlaceOrder(Guid streamCustomerId, IEnumerable<LocationServices> services, EnrollmentSaveResult originalSaveState, Dictionary<AdditionalAuthorization, bool> additionalAuthorizations)
        {
            var finalizeResponse = await streamConnectClient.PutAsJsonAsync("/api/customers/" + streamCustomerId.ToString() + "/enrollments/finalize", new {
                GlobalCustomerID = streamCustomerId,
                FinalizeRequests = from orderEntry in originalSaveState.Results
                    select new
                    {
                        authorizations = additionalAuthorizations.Select(ConvertAuthorization).Where(auth => auth != null),
                        EnrollmentAccountID = orderEntry.Details.GlobalEnrollmentAccountId
                    }
            });
            finalizeResponse.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await finalizeResponse.Content.ReadAsStringAsync());

            if (result.Status.Value == "Success")
            {
                return (from entry in originalSaveState.Results.Zip((IEnumerable<dynamic>)result.EnrollmentResponses, (saved, response) => new { saved, response })
                        select new LocationOfferDetails<PlaceOrderResult>
                {
                    Location = entry.saved.Location,
                    Offer = entry.saved.Offer,
                    Details = new PlaceOrderResult 
                    { 
                        ConfirmationNumber = entry.response.StreamReferenceNumber, 
                        IsSuccess = entry.response.Status.Value == "Success" 
                    }
                }).ToArray();
            }

            return Enumerable.Empty<LocationOfferDetails<PlaceOrderResult>>();
        }

        async Task<bool> IEnrollmentService.PlaceCommercialQuotes(UserContext context)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/Enrollments/commercial", new
            {
                ContactFirstName = context.ContactInfo.Name.First,
                ContactLastName = context.ContactInfo.Name.Last,
                ContactTitle = context.ContactTitle,
                ContactPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Work).Select(p => p.Number).FirstOrDefault(),
                ContactHomePhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Home).Select(p => p.Number).FirstOrDefault(),
                ContactCellPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Mobile).Select(p => p.Number).FirstOrDefault(),
                ContactEmail = context.ContactInfo.Email.Address,
                SSN = context.SocialSecurityNumber,
                BillingAddress = new
                {
                    StreetLine1 = context.MailingAddress.Line1,
                    StreetLine2 = context.MailingAddress.Line2,
                    City = context.MailingAddress.City,
                    State = context.MailingAddress.StateAbbreviation,
                    Zip = context.MailingAddress.PostalCode5
                },
                PreferredLanguage = context.Language == "en" ? "English" : "Spanish",
                PreferredSalesExecutive = context.PreferredSalesExecutive,
                UnderContract = true,
                SwitchType = "MoveIn",
                FederalTaxId = context.TaxId,
                DBA = context.DoingBusinessAs,
                Premises = (from serviceLocation in context.Services
                            let location = serviceLocation.Location
                            select ToCommercialPremise(location)).ToArray()
            });
            response.EnsureSuccessStatusCode();

            var result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return result["Status"].ToString() == "Success";
        }

        private object ToCommercialPremise(Location location)
        {
            string commodityType;
            string utilityAccountNumber;

            if (location.Capabilities.OfType<TexasServiceCapability>().Any())
            {
                commodityType = "Electricity";
                utilityAccountNumber = location.Capabilities.OfType<TexasServiceCapability>().First().EsiId;
            }
            else
            {
                throw new NotImplementedException();
            }

            return new
            {
                Provider = new
                {
                    Id = "",
                    Code = "",
                    Name = "",
                    Commodities = new[] { "Electricity" },
                },
                Commodity = commodityType,
                UtilityAccountNumber = utilityAccountNumber,
                ServiceAddress = new
                {
                    StreetLine1 = location.Address.Line1,
                    StreetLine2 = location.Address.Line2,
                    City = location.Address.City,
                    State = location.Address.StateAbbreviation,
                    Zip = location.Address.PostalCode5
                },
            };
        }

        private StreamConnect.CustomerAuthorization ConvertAuthorization(KeyValuePair<AdditionalAuthorization, bool> arg)
        {
            switch (arg.Key)
            {
                case AdditionalAuthorization.Tcpa:
                    return new StreamConnect.CustomerAuthorization 
                    {
                        AuthorizationType = StreamConnect.AuthorizationType.TCPA,
                        Accepted = arg.Value,
                        AcceptedDate = DateTime.Today
                    };
                default:
                    return null;
            }
        }


        private static dynamic ToStreamConnectAddress(Address addr)
        {
            dynamic serviceAddress = new
            {
                City = addr.City,
                State = addr.StateAbbreviation,
                StreetLine1 = addr.Line1,
                StreetLine2 = addr.Line2,
                Zip = addr.PostalCode5
            };
            return serviceAddress;
        }
    }
}
