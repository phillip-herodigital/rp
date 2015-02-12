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
using StreamEnergy.Logging;
using System.Collections.Specialized;

namespace StreamEnergy.Services.Clients
{
    class EnrollmentService : IEnrollmentService
    {
        private readonly HttpClient streamConnectClient;
        private readonly ILogger logger;
        private readonly Interpreters.IDpiEnrollmentParameters dpiEnrollmentParameters;
        private readonly ISet<ILocationAdapter> enrollmentLocationAdapters;

        public EnrollmentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, ILogger logger, Interpreters.IDpiEnrollmentParameters dpiEnrollmentParameters, ISet<ILocationAdapter> enrollmentLocationAdapters)
        {
            this.streamConnectClient = client;
            this.logger = logger;
            this.dpiEnrollmentParameters = dpiEnrollmentParameters;
            this.enrollmentLocationAdapters = enrollmentLocationAdapters;
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

                var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));
                
                var response = await streamConnectClient.PostAsJsonAsync("/api/v1-1/products", new
                {
                    CustomerType = customerType.CustomerType.ToString("g"),
                    EnrollmentType = serviceStatus.EnrollmentType.ToString("g"),
                    Details = locAdapter.GetProductRequest(location),
                });

                response.EnsureSuccessStatusCode();
                var streamConnectProductResponse = Json.Read<StreamConnect.ProductResponse>(await response.Content.ReadAsStringAsync());

                var entry = locAdapter.LoadOffers(location, streamConnectProductResponse);
                if (entry != null)
                {
                    result.Add(location, entry);
                }
            }
            return result;
        }

        async Task<PremiseVerificationResult> IEnrollmentService.VerifyPremise(Location location)
        {
            var serviceStatus = location.Capabilities.OfType<ServiceStatusCapability>().Single();
            if (serviceStatus.EnrollmentType == EnrollmentType.Renewal)
                return PremiseVerificationResult.Success;

            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();

            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

            if (locAdapter.SkipPremiseVerification(location))
                return PremiseVerificationResult.Success;
            
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/enrollments/verify-premise", new
            {
                ServiceAddress = StreamConnectUtilities.ToStreamConnectAddress(location.Address),
                UtilityAccountNumber = locAdapter.GetUtilityAccountNumber(location.Capabilities),
                CustomerType = customerType.CustomerType.ToString("g"),
                EnrollmentType = serviceStatus.EnrollmentType.ToString("g")
            });

            response.EnsureSuccessStatusCode();

            var result = Json.Read<StreamConnect.VerifyPremiseResponse>(await response.Content.ReadAsStringAsync());
            if (result.IsEligibleField)
                return PremiseVerificationResult.Success;

            if (result.FailureReason != null)
            {
                if (result.FailureReason.Contains("Switch is not allowed."))
                    return PremiseVerificationResult.MustMoveIn;
            }
            return PremiseVerificationResult.GeneralError;
        }

        async Task<bool> IEnrollmentService.IsEsnValid(string esn)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/enrollments/verify-esn", new
            {
                Esn = esn
            });

            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return result.IsValidEsn;
        }

        async Task<IConnectDatePolicy> IEnrollmentService.LoadConnectDates(Location location, IOffer offer)
        {
            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["Address.City"] = location.Address.City;
            parameters["Address.State"] = location.Address.StateAbbreviation;
            parameters["Address.StreetLine1"] = location.Address.Line1;
            parameters["Address.StreetLine2"] = location.Address.Line2;
            parameters["Address.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = locAdapter.GetUtilityAccountNumber(location.Capabilities);
            parameters["SystemOfRecord"] = locAdapter.GetSystemOfRecord();
            if (locAdapter.NeedProvider(location))
            {
                var provider = locAdapter.GetProvider(offer);
                parameters["Provider.Id"] = provider["Id"].ToString();

            }

            var response = await streamConnectClient.GetAsync("/api/v1/utility-providers/move-in-dates?" + parameters);
            response.EnsureSuccessStatusCode();

            dynamic result = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            //{"MoveInDates":[{"Date":"2014-08-04T00:00:00","Priority":true,"Fees":[{"Name":"Move In Date Fee","Amount":79.27}]}...]}

            return new ConnectDatePolicy()
            {
                AvailableConnectDates = (from entry in (IEnumerable<dynamic>)result.MoveInDates
                                         select new ConnectDate
                                         {
                                             Date = ((DateTimeOffset)entry.Date).Date,
                                             Classification = entry.Priority.Value ? ConnectDateClassification.Priority : ConnectDateClassification.Standard,
                                             Fees = ((IEnumerable<dynamic>)entry.Fees).ToDictionary(fee => (string)ToFeeQualifier(feeName: fee.Name.Value), fee => (decimal)fee.Amount.Value)
                                         }).ToArray()
            };
        }

        private async Task<JObject> LoadProvider(Location location)
        {
            var customerType = location.Capabilities.OfType<CustomerTypeCapability>().Single();
            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["ServiceAddress.City"] = location.Address.City;
            parameters["ServiceAddress.State"] = location.Address.StateAbbreviation;
            parameters["ServiceAddress.StreetLine1"] = location.Address.Line1;
            parameters["ServiceAddress.StreetLine2"] = location.Address.Line2;
            parameters["ServiceAddress.Zip"] = location.Address.PostalCode5;
            parameters["CustomerType"] = customerType.CustomerType == EnrollmentCustomerType.Residential ? "Residential" : "Commercial";

            var response = await streamConnectClient.GetAsync("/api/v1/utility-providers?" + parameters);
            response.EnsureSuccessStatusCode();

            var result = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return (JObject)result["Providers"].First();
        }

        private string ToFeeQualifier(string feeName)
        {
            switch (feeName)
            {
                case "Connection Fee":
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


        Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.BeginSaveEnrollment(Guid globalCustomerId, UserContext context, NameValueCollection dpiParameters)
        {
            return ((IEnrollmentService)this).BeginSaveUpdateEnrollment(globalCustomerId, null, context, dpiParameters, null);
        }

        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.EndSaveEnrollment(StreamAsync<EnrollmentSaveResult> asyncResult, UserContext context)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }

            response.EnsureSuccessStatusCode();

            asyncResult.IsCompleted = true;

            var responseObject = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            if ((string)responseObject["Status"] == "Success")
            {
                var enrollmentResponses = from customer in (IEnumerable<dynamic>)responseObject["EnrollmentResponses"]
                                          from account in (IEnumerable<dynamic>)customer.Accounts
                                          select account;

                asyncResult.Data = new EnrollmentSaveResult
                    {
                        Results = (from serviceWithIndex in context.Services.Select((service, index) => new { service, index })
                                   let service = serviceWithIndex.service
                                   from offerWithIndex in service.SelectedOffers.Select((offer, index) => new { offer, index })
                                   let offer = offerWithIndex.offer
                                   let index = serviceWithIndex.index.ToString() + " " + offerWithIndex.index.ToString()
                                   join entry in enrollmentResponses on index equals entry.UniqueKey.ToString()
                                   select new LocationOfferDetails<EnrollmentSaveEntry>
                                   {
                                       Details = new EnrollmentSaveEntry
                                       {
                                           EnrollmentAccountKeyJson = entry.Key.ToString(),
                                           GlobalEnrollmentAccountId = entry.Key.EnrollmentAccountId,
                                       },
                                       Location = service.Location,
                                       Offer = offer.Offer
                                   }).ToArray()
                    };
            }
            else
            {
                await logger.Record(new LogEntry
                    {
                        Message = "Error from Stream Connect",
                        Severity = Severity.Error,
                        Data = { { "Stream Connect Response", responseObject } }
                    });
            }

            return asyncResult;
        }

        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.BeginSaveUpdateEnrollment(Guid globalCustomerId, EnrollmentSaveResult enrollmentSaveResult, UserContext context, NameValueCollection dpiParameters, IEnumerable<LocationOfferDetails<OfferPayment>> offerPayments)
        {
            if (enrollmentSaveResult != null)
            {
                foreach (var oldEnrollmentAccountId in from oldResult in enrollmentSaveResult.Results
                                                       where !context.Services.Any(svcLoc => svcLoc.Location == oldResult.Location && svcLoc.SelectedOffers.Any(o => o.Offer.OfferType == oldResult.Offer.OfferType))
                                                       select oldResult.Details.GlobalEnrollmentAccountId)
                {
                    await ((IEnrollmentService)this).DeleteEnrollment(globalCustomerId, oldEnrollmentAccountId);
                }
            }


            dpiEnrollmentParameters.Initialize(dpiParameters);
            var salesInfo = dpiEnrollmentParameters.ToStreamConnectSalesInfo();
            Func<LocationServices, SelectedOffer, OfferPayment> findOfferPayment = (service, offer) =>
                {
                    if (offerPayments == null)
                        return null;
                    var temp = offerPayments.SingleOrDefault(o => o.Location == service.Location && o.Offer.Id == offer.Offer.Id);
                    if (temp != null)
                        return temp.Details;
                    return null;
                };
            Func<LocationServices, SelectedOffer, int, JObject> findSaveId = (service, offer, index) =>
            {
                if (enrollmentSaveResult == null)
                    return null;
                return enrollmentSaveResult.Results
                    .Skip(index)
                    .Where(r => r.Offer.OfferType == offer.Offer.OfferType && r.Location == service.Location)
                    .Select(r => JObject.Parse(r.Details.EnrollmentAccountKeyJson))
                    .FirstOrDefault();
            };

            var request = (from serviceWithIndex in context.Services.Select((service, index) => new { service, index })
                           let service = serviceWithIndex.service
                           from offerWithIndex in service.SelectedOffers.Select((offer, index) => new { offer, index })
                           let offer = offerWithIndex.offer
                           let index = serviceWithIndex.index.ToString() + " " + offerWithIndex.index.ToString()
                           let previousSaveId = findSaveId(service, offer, offerWithIndex.index)
                           let locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(service.Location.Capabilities, offer.Offer))
                           let accountDetails = new EnrollmentAccountDetails 
                           { 
                               RequestUniqueKey = index, 
                               Location = service.Location, 
                               Offer = offer, 
                               EnrollmentAccountKey = previousSaveId, 
                               OfferPayments = findOfferPayment(service, offer) 
                           }
                           group accountDetails by locAdapter into systemOfRecordSet
                           let customerType = systemOfRecordSet.First().Location.Capabilities.OfType<CustomerTypeCapability>().Single()
                           select new
                           {
                               GlobalCustomerId = globalCustomerId.ToString(),
                               SystemOfRecord = systemOfRecordSet.Key.GetSystemOfRecord(),
                               SalesInfo = salesInfo,
                               CustomerType = customerType.CustomerType.ToString("g"),
                               FirstName = context.ContactInfo.Name.First,
                               LastName = context.ContactInfo.Name.Last,
                               BillingAddress = StreamConnectUtilities.ToStreamConnectAddress(context.MailingAddress),
                               HomePhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Home).Select(p => p.Number).SingleOrDefault(),
                               CellPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Mobile).Select(p => p.Number).SingleOrDefault(),
                               WorkPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Work).Select(p => p.Number).SingleOrDefault(),
                               SSN = context.SocialSecurityNumber,
                               CurrentProvider = context.PreviousProvider,
                               EmailAddress = context.ContactInfo.Email.Address,
                               Accounts = from account in systemOfRecordSet
                                          select systemOfRecordSet.Key.ToEnrollmentAccount(globalCustomerId, account)
                           }).ToArray();
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1-1/customers/" + globalCustomerId.ToString() + "/enrollments", request);
            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<EnrollmentSaveResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }
        
        async Task<bool> IEnrollmentService.DeleteEnrollment(Guid globalCustomerId, Guid enrollmentAccountId)
        {
            var response = await streamConnectClient.DeleteAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/enrollments/" + enrollmentAccountId);
            response.EnsureSuccessStatusCode();
            dynamic responseObject = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return ((string)responseObject.Status) == "Success";
        }
        
        async Task<IdentityCheckResult> IEnrollmentService.LoadIdentityQuestions(Guid streamCustomerId, Name name, string ssn, Address mailingAddress)
        {

            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + streamCustomerId.ToString() + "/enrollments/verifications/id-questions", new
            {
                FirstName = name.First,
                LastName = name.Last,
                SSN = ssn,
                Address = StreamConnectUtilities.ToStreamConnectAddress(mailingAddress)
            });
            response.EnsureSuccessStatusCode();
            var responseString = await response.Content.ReadAsStringAsync();
            var result = Json.Read<StreamConnect.IdVerificationChallengeResponse>(responseString);

            if (result.Status != "Success")
            {
                return new IdentityCheckResult { IdentityAccepted = false, IdentityQuestions = new IdentityQuestion[0], HardStop = null };
            }

            return new IdentityCheckResult
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
            };
        }
        
        async Task<StreamAsync<IdentityCheckResult>> IEnrollmentService.BeginIdentityCheck(Guid streamCustomerId, Name name, string ssn, Address mailingAddress, AdditionalIdentityInformation identityInformation)
        {
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1/customers/" + streamCustomerId.ToString() + "/enrollments/verifications/id-questions", new
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

        async Task<StreamAsync<IdentityCheckResult>> IEnrollmentService.EndIdentityCheck(StreamAsync<IdentityCheckResult> asyncResult)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }
            response.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            asyncResult.IsCompleted = true;
            asyncResult.Data = new IdentityCheckResult
            {
                IdentityAccepted = result.CollectDeposit,
                IdentityQuestions = new IdentityQuestion[0]
            };
            return asyncResult;
        }

        async Task<StreamAsync<CreditCheckResult>> IEnrollmentService.BeginCreditCheck(Guid streamCustomerId, Name name, string ssn, Address address)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + streamCustomerId.ToString() + "/enrollments/verifications/credit-check", new
            {
                FirstName = name.First,
                LastName = name.Last,
                SSN = ssn,
                Address = StreamConnectUtilities.ToStreamConnectAddress(address)
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

            asyncResult.IsCompleted = true;
            asyncResult.Data = new CreditCheckResult { };
            return asyncResult;
        }

        async Task<IEnumerable<LocationOfferDetails<OfferPayment>>> IEnrollmentService.LoadOfferPayments(Guid streamCustomerId, EnrollmentSaveResult enrollmentSaveStates, IEnumerable<LocationServices> services, InternalContext internalContext)
        {
            var assessDeposit = false;
            if (internalContext.IdentityCheck != null && internalContext.IdentityCheck.Data != null)
            {
                assessDeposit = internalContext.IdentityCheck.Data.IdentityAccepted;
            }

            var response = await streamConnectClient.GetAsync("/api/v1-1/customers/" + streamCustomerId + "/enrollments");
            response.EnsureSuccessStatusCode();

            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            var locationOfferByEnrollmentAccountId = enrollmentSaveStates.Results.ToDictionary(r => r.Details.GlobalEnrollmentAccountId);
            var offerPaymentResults = new List<LocationOfferDetails<OfferPayment>>();

            foreach (var customer in result.EnrollmentCustomers)
            {
                foreach (var entry in customer.Accounts)
                {
                    var enrollmentAccountId = Guid.Parse((string)entry.Key.EnrollmentAccountId.Value);
                    if (locationOfferByEnrollmentAccountId.ContainsKey(enrollmentAccountId))
                    {
                        var location = locationOfferByEnrollmentAccountId[enrollmentAccountId].Location;
                        var offer = locationOfferByEnrollmentAccountId[enrollmentAccountId].Offer;
                        var option = services.First(s => s.Location == location).SelectedOffers.First(s => s.Offer.Id == offer.Id).OfferOption;
                        var optionRules = internalContext.OfferOptionRules.First(rule => rule.Location == location && rule.Offer.Id == offer.Id).Details;
                        var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

                        offerPaymentResults.Add(new LocationOfferDetails<OfferPayment>
                            {
                                Location = location,
                                Offer = offer,
                                Details = locAdapter.GetOfferPayment(entry, assessDeposit, optionRules, option)
                            });
                    }
                }
            }

            return offerPaymentResults;
        }

        //async Task<IEnumerable<LocationOfferDetails<DomainModels.Payments.PaymentResult>>> IEnrollmentService.PayDeposit(IEnumerable<LocationOfferDetails<OfferPayment>> depositData, IEnumerable<LocationOfferDetails<EnrollmentSaveEntry>> enrollmentSaveEntries, DomainModels.Payments.IPaymentInfo paymentInfo, UserContext context)
        //{
        //    var card = paymentInfo as DomainModels.Payments.TokenizedCard;
        //    if (card == null)
        //        return Enumerable.Empty<LocationOfferDetails<DomainModels.Payments.PaymentResult>>();

        //    List<LocationOfferDetails<DomainModels.Payments.PaymentResult>> result = new List<LocationOfferDetails<DomainModels.Payments.PaymentResult>>();
        //    foreach (var deposit in from deposit in depositData
        //                            let amt = deposit.Details.RequiredAmounts.OfType<DepositOfferPaymentAmount>().SingleOrDefault()
        //                            where amt != null
        //                            where !context.Services.FirstOrDefault(svc => svc.Location == deposit.Location).SelectedOffers.FirstOrDefault(o => o.Offer.Id == deposit.Offer.Id).WaiveDeposit || !amt.CanBeWaived
        //                            group new { deposit.Location, deposit.Offer, amt.DollarAmount } by new { amt.SystemOfRecord, amt.DepositAccount })
        //    {
        //        var depositAmount = deposit.Sum(d => d.DollarAmount);
        //        if (depositAmount == 0)
        //        {
        //            continue;
        //        }

        //        var response = await streamConnectClient.PostAsJsonAsync("/api/v1/payments/one-time", new
        //        {
        //            PaymentDate = DateTime.Today,
        //            InvoiceType = "Deposit",
        //            Amount = depositAmount,
        //            StreamAccountNumber = deposit.Key.DepositAccount,
        //            CustomerName = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
        //            SystemOfRecord = deposit.Key.SystemOfRecord,
        //            PaymentAccount = new
        //            {
        //                Token = card.CardToken,
        //                AccountType = "Unknown",
        //                ExpirationDate = new { Year = card.ExpirationDate.Year, Month = card.ExpirationDate.Month },
        //                Name = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
        //                Postal = card.BillingZipCode,
        //            },
        //            Cvv = card.SecurityCode
        //        });
        //        dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

        //        foreach (var entry in deposit)
        //        {
        //            result.Add(new LocationOfferDetails<DomainModels.Payments.PaymentResult>
        //                {
        //                    Location = entry.Location,
        //                    Offer = entry.Offer,
        //                    Details = new DomainModels.Payments.PaymentResult
        //                    {
        //                        ConfirmationNumber = jobject.ConfirmationNumber,
        //                        ConvenienceFee = (decimal)jobject.ConvenienceFee.Value,
        //                    }
        //                });
        //        }
        //    }

        //    return result.ToArray();
        //}


        async Task<StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>> IEnrollmentService.BeginPlaceOrder(UserContext context, InternalContext internalContext)
        {
            var hasSpecialCommercial = (from service in context.Services
                                        let locAdapter = enrollmentLocationAdapters.FirstOrDefault(e => e.IsFor(service.Location.Capabilities))
                                        select locAdapter.HasSpecialCommercialEnrollment(service.Location.Capabilities)).Any(e => e);

            if (hasSpecialCommercial)
            {
                // WARNING - if this is mixed special enrollment vs. standard enrollment, the standard enrollment gets skipped!
                var results = await PlaceCommercialQuotes(context);
                return new StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>
                    {
                        IsCompleted = true,
                        Data = (from service in context.Services
                                select new LocationOfferDetails<PlaceOrderResult>()
                                {
                                    Location = service.Location,
                                    Details = results,
                                    Offer = service.SelectedOffers.First().Offer,
                                }).ToArray()
                    };
            }

            var streamCustomerId = internalContext.GlobalCustomerId;
            var originalSaveState = internalContext.EnrollmentSaveState.Data;
            var depositInfo = internalContext.Deposit ?? Enumerable.Empty<DomainModels.Enrollments.Service.LocationOfferDetails<OfferPayment>>();
            
            List<object> initialPayments = new List<object>();
            if (context.PaymentInfo is DomainModels.Payments.TokenizedCard)
            {
                var card = (DomainModels.Payments.TokenizedCard)context.PaymentInfo;
                foreach (var deposit in from deposit in internalContext.Deposit
                                        let amt = deposit.Details.RequiredAmounts.OfType<IInitialPaymentAmount>().SingleOrDefault()
                                        where amt != null
                                        where !context.Services.FirstOrDefault(svc => svc.Location == deposit.Location).SelectedOffers.FirstOrDefault(o => o.Offer.Id == deposit.Offer.Id).WaiveDeposit || !amt.CanBeWaived
                                        group new { deposit.Location, deposit.Offer, amt.DollarAmount } by new { amt.SystemOfRecord, amt.DepositAccount })
                {
                    var depositAmount = deposit.Sum(d => d.DollarAmount);
                    if (depositAmount == 0)
                    {
                        continue;
                    }

                    initialPayments.Add(new
                    {
                        PaymentDate = DateTime.Today,
                        InvoiceType = "Deposit",
                        Amount = depositAmount,
                        StreamAccountNumber = deposit.Key.DepositAccount,
                        CustomerName = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
                        SystemOfRecord = deposit.Key.SystemOfRecord,
                        PaymentAccount = new
                        {
                            Token = card.CardToken,
                            AccountType = card.Type,
                            ExpirationDate = new { Year = card.ExpirationDate.Year, Month = card.ExpirationDate.Month },
                            Name = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
                            Postal = card.BillingZipCode,
                        },
                        Cvv = card.SecurityCode
                    });
                }
            }

            var response = await streamConnectClient.PostAsJsonAsync("/api/v1-1/customers/" + streamCustomerId.ToString() + "/enrollments/finalize", new {
                GlobalCustomerID = streamCustomerId,
                Authorizations = new[] { new KeyValuePair<string, bool>("TermsAndConditions", true) }.Concat(context.AdditionalAuthorizations.SelectMany(ConvertAuthorization)).ToDictionary(kvp => kvp.Key, kvp => kvp.Value),
                EnrollmentAccounts = from orderEntry in originalSaveState.Results
                                     let hasDeposit = depositInfo
                                        .Where(depositAmounts => orderEntry.Location == depositAmounts.Location && orderEntry.Offer.Id == depositAmounts.Offer.Id)
                                        .Any(depositAmounts => depositAmounts.Details.RequiredAmounts.Any(amt => amt is DepositOfferPaymentAmount && amt.DollarAmount > 0))
                                     join locationService in context.Services on orderEntry.Location equals locationService.Location
                                     let offer = locationService.SelectedOffers.FirstOrDefault(o => o.Offer.Id == orderEntry.Offer.Id)
                                     where offer != null
                                     select new
                                     {
                                         EnrollmentAccountId = orderEntry.Details.GlobalEnrollmentAccountId,
                                         DepositWaiverRequested = offer.WaiveDeposit,
                                         DepositPaymentMade = hasDeposit && !offer.WaiveDeposit
                                     },
                InitialPayments = initialPayments,
                RequireReview = internalContext.IdentityCheck == null || !internalContext.IdentityCheck.Data.IdentityAccepted
            });

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }

        async Task<StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>>> IEnrollmentService.EndPlaceOrder(StreamAsync<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> asyncResult, EnrollmentSaveResult originalSaveState)
        {
            var finalizeResponse = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (finalizeResponse.StatusCode == System.Net.HttpStatusCode.NoContent)
            {
                return asyncResult;
            }
            finalizeResponse.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await finalizeResponse.Content.ReadAsStringAsync());

            asyncResult.IsCompleted = true;
            if (result.Status.Value == "Success")
            {
                asyncResult.Data = (from saved in originalSaveState.Results
                                    let response = ((IEnumerable<dynamic>)result.EnrollmentResponses)
                                        .SelectMany(r => (IEnumerable<dynamic>)r.Accounts)
                                        .First(r => r.GlobalEnrollmentAccountId == saved.Details.GlobalEnrollmentAccountId)
                                    select new LocationOfferDetails<PlaceOrderResult>
                                    {
                                        Location = saved.Location,
                                        Offer = saved.Offer,
                                        Details = new PlaceOrderResult
                                        {
                                            ConfirmationNumber = response.EnrollmentReferenceNumber,
                                            IsSuccess = response.Status == "Success",
                                            PaymentConfirmation = ToPaymentResult(response.PaymentResponse),
                                        }
                                    }).ToArray();
            }

            return asyncResult;
        }

        private DomainModels.Payments.PaymentResult ToPaymentResult(dynamic paymentResponse)
        {
            if (paymentResponse == null)
                return null;

            return new DomainModels.Payments.PaymentResult
            {
                ConfirmationNumber = paymentResponse.ConfirmationNumber,
                ConvenienceFee = (decimal)paymentResponse.ConvenienceFee.Value,
            };
        }

        public async Task<PlaceOrderResult> PlaceCommercialQuotes(UserContext context)
        {
            List<object> premises = new List<object>();
            foreach (var serviceLocation in context.Services)
            {
                var location = serviceLocation.Location;
                premises.Add(await ToCommercialPremise(location));
            }

            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/commercial-request-for-quote", new
            {
                CompanyName = context.CompanyName,
                ContactFirstName = context.ContactInfo.Name.First,
                ContactLastName = context.ContactInfo.Name.Last,
                ContactTitle = context.ContactTitle,
                ContactWorkPhone = context.ContactInfo.Phone.OfType<TypedPhone>().Where(p => p.Category == PhoneCategory.Work).Select(p => p.Number).FirstOrDefault(),
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
                Premises = premises.ToArray()
            });
            response.EnsureSuccessStatusCode();

            var result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return new PlaceOrderResult()
            {
                IsSuccess = result["Status"].ToString() == "Success",
                ConfirmationNumber = (string)result["ReferenceNumber"],
            };
        }

        private async Task<object> ToCommercialPremise(Location location)
        {
            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

            string commodityType = locAdapter.GetCommodityType();
            string utilityAccountNumber = locAdapter.GetUtilityAccountNumber(location.Capabilities);

            var provider = await LoadProvider(location);

            return new
            {
                Provider = provider,
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

        private IEnumerable<KeyValuePair<string, bool>> ConvertAuthorization(KeyValuePair<AdditionalAuthorization, bool> arg)
        {
            switch (arg.Key)
            {
                case AdditionalAuthorization.Tcpa:
                    if (arg.Value)
                    {
                        return new Dictionary<string, bool>
                        {
                            { "TCPA", true },
                            { "TheWireOptIn", true },
                        };
                    }
                    else
                    {
                        return Enumerable.Empty<KeyValuePair<string, bool>>();
                    }
                default:
                    return Enumerable.Empty<KeyValuePair<string, bool>>();
            }
        }


        async Task<StreamAsync<RenewalResult>> IEnrollmentService.BeginRenewal(DomainModels.Accounts.Account account, DomainModels.Accounts.ISubAccount subAccount, IOffer offer, IOfferOption renewalOptions)
        {
            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(subAccount));

            string code, id;

            locAdapter.GetRenewalValues(offer, out code, out id);

            account.Capabilities.RemoveAll(r => r.CapabilityType == DomainModels.Accounts.RenewalAccountCapability.Qualifier);
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/renewals", new
                {
                    SystemOfRecordAccountNumber = account.AccountNumber,
                    ProductCode = code,
                    ProductId = id,
                    //StartDate = ???,
                    CustomerLast4 = account.Details.SsnLastFour,
                    SystemOfRecord = account.SystemOfRecord,
                    ProductType = subAccount.ProductType,
                    UtilityAccountNumber = locAdapter.GetUtilityAccountNumber(subAccount),
                    EmailAddress = account.Details.ContactInfo.Email == null ? null : account.Details.ContactInfo.Email.Address,
                    ProviderId = locAdapter.GetProvider(subAccount),
                    ContactInfo = account.Details.ContactInfo,
                    MailingAddress = account.Details.BillingAddress,
                });
            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<RenewalResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }

        async Task<StreamAsync<RenewalResult>> IEnrollmentService.EndRenewal(StreamAsync<RenewalResult> asyncResult)
        {
            var response = await streamConnectClient.GetAsync(asyncResult.ResponseLocation);
            if (response.StatusCode == System.Net.HttpStatusCode.NoContent)
        {
                return asyncResult;
            }


            asyncResult.IsCompleted = true;

            dynamic jobject = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            asyncResult.Data = new RenewalResult
            {
                ConfirmationNumber = (string)jobject.CisAccountNumber,
                IsSuccess = (string)jobject.Status == "Success",
                RenewalDate = (DateTime?)jobject.RenewalDate,
                ContractStartDate = (DateTime?)jobject.ContractStartDate,
                ContractEndDate = (DateTime?)jobject.ContractEndDate,
            };
            return asyncResult;
        }
    }
}
