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
        private readonly ISet<IEnrollmentLocationAdapter> enrollmentLocationAdapters;

        public EnrollmentService([Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, ILogger logger, Interpreters.IDpiEnrollmentParameters dpiEnrollmentParameters, ISet<IEnrollmentLocationAdapter> enrollmentLocationAdapters)
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

                var parameters = System.Web.HttpUtility.ParseQueryString("");
                parameters["ServiceAddress.City"] = location.Address.City;
                parameters["ServiceAddress.State"] = location.Address.StateAbbreviation;
                parameters["ServiceAddress.StreetLine1"] = location.Address.Line1;
                parameters["ServiceAddress.StreetLine2"] = location.Address.Line2;
                parameters["ServiceAddress.Zip"] = location.Address.PostalCode5;

                parameters["CustomerType"] = customerType.CustomerType.ToString("g");
                parameters["EnrollmentType"] = serviceStatus.EnrollmentType.ToString("g");

                var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));
                parameters["UtilityAccountNumber"] = locAdapter.GetUtilityAccountNumber(location.Capabilities);
                parameters["SystemOfRecord"] = locAdapter.GetSystemOfRecord(location.Capabilities);

                var response = await streamConnectClient.GetAsync("/api/v1/products?" + parameters.ToString());

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

        async Task<IConnectDatePolicy> IEnrollmentService.LoadConnectDates(Location location)
        {
            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

            var parameters = System.Web.HttpUtility.ParseQueryString("");
            parameters["Address.City"] = location.Address.City;
            parameters["Address.State"] = location.Address.StateAbbreviation;
            parameters["Address.StreetLine1"] = location.Address.Line1;
            parameters["Address.StreetLine2"] = location.Address.Line2;
            parameters["Address.Zip"] = location.Address.PostalCode5;
            parameters["UtilityAccountNumber"] = locAdapter.GetUtilityAccountNumber(location.Capabilities);
            parameters["SystemOfRecord"] = locAdapter.GetSystemOfRecord(location.Capabilities);

            var response = await streamConnectClient.GetAsync("/api/v1/utility-providers/move-in-dates?" + parameters);
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


        async Task<StreamAsync<EnrollmentSaveResult>> IEnrollmentService.BeginSaveEnrollment(Guid globalCustomerId, UserContext context, NameValueCollection dpiParameters)
        {
            dpiEnrollmentParameters.Initialize(dpiParameters);
            var salesInfo = dpiEnrollmentParameters.ToStreamConnectSalesInfo();

            var request = (from service in context.Services
                           from offer in service.SelectedOffers
                           let locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(service.Location.Capabilities, offer.Offer))
                           select locAdapter.ToEnrollmentAccount(globalCustomerId, context, service, offer, salesInfo)).ToArray();
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/enrollments", request);
            response.EnsureSuccessStatusCode();

            var asyncUrl = response.Headers.Location;
            return new StreamAsync<EnrollmentSaveResult>
            {
                IsCompleted = false,
                ResponseLocation = asyncUrl
            };
        }

        private object BuildDepositObject(SelectedOffer offer, OfferPayment offerPayment)
        {
            if (offerPayment == null)
                return null;
            return new
            {
                Amount = offerPayment.RequiredAmounts.OfType<DepositOfferPaymentAmount>().FirstOrDefault().DollarAmount,
                IsWaived = offer.WaiveDeposit,
            };
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
                                       StreamReferenceNumber = entry.EnrollmentReferenceNumber,
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

            var request = (from service in context.Services
                           from offer in service.SelectedOffers
                           let previousSaveId = enrollmentSaveResult.Results.Where(r => r.Offer.Id == offer.Offer.Id && r.Location == service.Location).Select(r => (Guid?)r.Details.GlobalEnrollmentAccountId).FirstOrDefault()
                           let locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(service.Location.Capabilities, offer.Offer))
                           select locAdapter.ToEnrollmentAccount(globalCustomerId, context, service, offer, salesInfo, previousSaveId ?? Guid.Empty, BuildDepositObject(offer, findOfferPayment(service, offer)))).ToArray();
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/enrollments", request);
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
                    // TODO - this block is probably wrong, but I don't know that for certain.
                    return new StreamAsync<IdentityCheckResult>
                    {
                        IsCompleted = true,
                        Data = new IdentityCheckResult { IdentityAccepted = false, IdentityQuestions = new IdentityQuestion[0], HardStop = null }
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

            // TODO - do something with the response? 

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

            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + streamCustomerId + "/enrollments");
            response.EnsureSuccessStatusCode();

            dynamic result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            var locationOfferByEnrollmentAccountId = enrollmentSaveStates.Results.ToDictionary(r => r.Details.GlobalEnrollmentAccountId);
            var offerPaymentResults = new List<LocationOfferDetails<OfferPayment>>();

            foreach (var entry in result.EnrollmentAccounts)
            {
                var enrollmentAccountId = Guid.Parse((string)entry.EnrollmentAccountId.Value);
                if (locationOfferByEnrollmentAccountId.ContainsKey(enrollmentAccountId))
                {
                    decimal deposit = 0;
                    if (assessDeposit && entry.Premise.Deposit != null)
                        deposit = (decimal)entry.Premise.Deposit.Amount.Value;

                    var location = locationOfferByEnrollmentAccountId[enrollmentAccountId].Location;
                    var offer = locationOfferByEnrollmentAccountId[enrollmentAccountId].Offer;
                    var option = services.First(s => s.Location == location).SelectedOffers.First(s => s.Offer.Id == offer.Id).OfferOption;
                    var optionRules = internalContext.OfferOptionRules.First(rule => rule.Location == location && rule.Offer.Id == offer.Id).Details;

                    offerPaymentResults.Add(new LocationOfferDetails<OfferPayment>
                        {
                            Location = location,
                            Offer = offer,
                            Details = new OfferPayment
                            {
                                EnrollmentAccountNumber = entry.EnrollmentAccountNumber,
                                OngoingAmounts = new IOfferPaymentAmount[] 
                                {
                                    // TODO - is there something here?
                                },
                                RequiredAmounts = new IOfferPaymentAmount[] 
                                {
                                    // TODO future - installation fees
                                    new DepositOfferPaymentAmount { DollarAmount = deposit }
                                },
                                PostBilledAmounts = optionRules.GetPostBilledPayments(option)
                            }
                        });
                }
            }

            return offerPaymentResults;
        }

        async Task<IEnumerable<LocationOfferDetails<DomainModels.Payments.PaymentResult>>> IEnrollmentService.PayDeposit(IEnumerable<LocationOfferDetails<OfferPayment>> depositData, IEnumerable<LocationOfferDetails<EnrollmentSaveEntry>> enrollmentSaveEntries, DomainModels.Payments.IPaymentInfo paymentInfo, UserContext context)
        {
            var card = paymentInfo as DomainModels.Payments.TokenizedCard;
            if (card == null)
                return Enumerable.Empty<LocationOfferDetails<DomainModels.Payments.PaymentResult>>();

            List<LocationOfferDetails<DomainModels.Payments.PaymentResult>> result = new List<LocationOfferDetails<DomainModels.Payments.PaymentResult>>();
            foreach (var deposit in depositData)
            {
                var waiveDeposit = context.Services.FirstOrDefault(svc => svc.Location == deposit.Location).SelectedOffers.FirstOrDefault(o => o.Offer.Id == deposit.Offer.Id).WaiveDeposit;
                var depositAmount = deposit.Details.RequiredAmounts.Where(req => req.OfferPaymentAmountType == DepositOfferPaymentAmount.Qualifier && (!waiveDeposit || !req.CanBeWaived)).Sum(req => req.DollarAmount);

                if (depositAmount == 0)
                {
                    continue;
                }

                var response = await streamConnectClient.PostAsJsonAsync("/api/v1/payments/one-time", new
                {
                    PaymentDate = DateTime.Today,
                    InvoiceType = "Deposit",
                    Amount = depositAmount,
                    StreamAccountNumber = deposit.Details.EnrollmentAccountNumber,
                    CustomerName = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
                    // We won't want to hard-code this later
                    SystemOfRecord = "Kubra",
                    PaymentAccount = new 
                    { 
                        Token = card.CardToken,
                        AccountType = "Unknown",
                        ExpirationDate = new { Year = card.ExpirationDate.Year, Month = card.ExpirationDate.Month },
                        Name = context.ContactInfo.Name.First + " " + context.ContactInfo.Name.Last,
                        Postal = card.BillingZipCode,                        
                    },
                    Cvv = card.SecurityCode
                });
                dynamic jobject = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

                result.Add(new LocationOfferDetails<DomainModels.Payments.PaymentResult>
                    {
                        Location = deposit.Location,
                        Offer = deposit.Offer,
                        Details = new DomainModels.Payments.PaymentResult
                        {
                            ConfirmationNumber = jobject.ConfirmationNumber,
                            ConvenienceFee = (decimal)jobject.ConvenienceFee.Value,
                        }
                    });
            }

            return result.ToArray();
        }


        async Task<IEnumerable<LocationOfferDetails<PlaceOrderResult>>> IEnrollmentService.PlaceOrder(Guid streamCustomerId, IEnumerable<LocationServices> services, EnrollmentSaveResult originalSaveState, Dictionary<AdditionalAuthorization, bool> additionalAuthorizations)
        {
            var finalizeResponse = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + streamCustomerId.ToString() + "/enrollments/finalize", new {
                GlobalCustomerID = streamCustomerId,
                Authorizations = new[] { new KeyValuePair<string, bool>("TermsAndConditions", true) }.Concat(additionalAuthorizations.SelectMany(ConvertAuthorization)).ToDictionary(kvp => kvp.Key, kvp => kvp.Value),
                EnrollmentAccountIds = originalSaveState.Results.Select(orderEntry => orderEntry.Details.GlobalEnrollmentAccountId)
            });
            finalizeResponse.EnsureSuccessStatusCode();
            dynamic result = Json.Read<JObject>(await finalizeResponse.Content.ReadAsStringAsync());

            if (result.Status.Value == "Success")
            {
                return (from saved in originalSaveState.Results
                        let response = (dynamic)((IEnumerable<dynamic>)result.EnrollmentResponses).First(r => r.GlobalEnrollmentAccountId == saved.Details.GlobalEnrollmentAccountId)
                        select new LocationOfferDetails<PlaceOrderResult>
                {
                    Location = saved.Location,
                    Offer = saved.Offer,
                    Details = new PlaceOrderResult 
                    { 
                        ConfirmationNumber = response.EnrollmentReferenceNumber, 
                        IsSuccess = response.Status.Value == "Success" 
                    }
                }).ToArray();
            }

            return Enumerable.Empty<LocationOfferDetails<PlaceOrderResult>>();
        }

        async Task<PlaceOrderResult> IEnrollmentService.PlaceCommercialQuotes(UserContext context)
        {
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
                Premises = (from serviceLocation in context.Services
                            let location = serviceLocation.Location
                            select ToCommercialPremise(location)).ToArray()
            });
            response.EnsureSuccessStatusCode();

            var result = Json.Read<JObject>(await response.Content.ReadAsStringAsync());

            return new PlaceOrderResult()
            {
                IsSuccess = result["Status"].ToString() == "Success",
                ConfirmationNumber = (string)result["ReferenceNumber"],
            };
        }

        private object ToCommercialPremise(Location location)
        {
            var locAdapter = enrollmentLocationAdapters.First(adapter => adapter.IsFor(location.Capabilities));

            string commodityType = locAdapter.GetCommodityType();
            string utilityAccountNumber = locAdapter.GetUtilityAccountNumber(location.Capabilities);

            return new
            {
                Provider = new
                {
                    Id = "",
                    Code = "",
                    Name = "",
                    Commodities = new[] { commodityType },
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


        async Task<StreamAsync<RenewalResult>> IEnrollmentService.BeginRenewal(DomainModels.Accounts.Account account, DomainModels.Enrollments.Renewal.OfferOption renewalOptions)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/renewals", new
                {
                    SystemOfRecordAccountNumber = account.AccountNumber,
                    ProductCode = (string)null, // TODO
                    StartDate = renewalOptions.RenewalDate,
                    CustomerLast4 = account.Details.SsnLastFour,
                    SystemOfRecord = account.SystemOfRecord,
                    ProductType = account.Details.ProductType,
                    UtilityAccountNumber = (string)null, // TODO
                    EmailAddress = account.Details.ContactInfo.Email == null ? null : account.Details.ContactInfo.Email.Address,
                    ProviderId = (string)null, // TODO
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
                IsSuccess = (string)jobject.RenewalDate == "Success",
                RenewalDate = (DateTime)jobject.RenewalDate,
                ContractStartDate = (DateTime)jobject.ContractStartDate,
                ContractEndDate = (DateTime)jobject.ContractEndDate,
            };
            return asyncResult;
        }
    }
}
