using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using System.Net.Http;
using Legacy = StreamEnergy.DomainModels.Accounts.Legacy;
using System.IO;
using StreamEnergy.DomainModels;
using StreamEnergy.DomainModels.Enrollments;

namespace StreamEnergy.Services.Clients
{
    class AccountService : IAccountService
    {
        private readonly StreamCommons.Account.CisAccountServicesPortType accountService;
        private readonly StreamEnergy.Dpi.DPILinkSoap dpiLinkService;
        private readonly HttpClient streamConnectClient;
        private readonly string sharedAccessSignature;
        private readonly AccountFactory accountFactory;
        private readonly ISet<ILocationAdapter> locationAdapters;

        private static Dictionary<string, string> _cis2AureaAccountMapping { get; set; }
        private static Dictionary<string, string> cis2AureaAccountMapping
        {
            get
            {
                if (_cis2AureaAccountMapping == null)
                {
                    _cis2AureaAccountMapping = new Dictionary<string, string>();
                    Sitecore.Data.Items.MediaItem item = Sitecore.Context.Database.GetItem(new Sitecore.Data.ID("{CE3C3112-536E-4239-A888-623296B75463}"));
                    using (StreamReader reader = new StreamReader(item.GetMediaStream(), Encoding.UTF8))
                    {
                        var content = reader.ReadToEnd();
                        var lines = content.Split(new string[] { "\r\n", "\r" }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var line in lines)
                        {
                            var parts = line.Split(',');
                            if (parts.Length == 2)
                            {
                                _cis2AureaAccountMapping.Add(parts[1], parts[0]);
                            }
                        }
                    }
                }
                return _cis2AureaAccountMapping;
            }
        }

        public AccountService(StreamCommons.Account.CisAccountServicesPortType accountService, StreamEnergy.Dpi.DPILinkSoap dpiLinkService, [Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, [Dependency(StreamConnectContainerSetup.StreamConnectSharedAccessSignature)] string sharedAccessSignature, AccountFactory accountFactory, ISet<ILocationAdapter> locationAdapters)
        {
            this.accountService = accountService;
            this.dpiLinkService = dpiLinkService;
            this.streamConnectClient = client;
            this.sharedAccessSignature = sharedAccessSignature;
            this.accountFactory = accountFactory;
            this.locationAdapters = locationAdapters;
        }

        async Task<IEnumerable<Account>> IAccountService.GetInvoices(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/invoices");
            response.EnsureSuccessStatusCode();
            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            if (data.Status == "Success")
            {
                return accountFactory.Merge(existingAccountObjects,
                    from invoice in ((IEnumerable<dynamic>)data.Invoices)
                    group new Invoice
                    {
                        InvoiceNumber = invoice.InvoiceId.ToString(),
                        DueDate = invoice.DueDate,
                        InvoiceAmount = (decimal)invoice.AmountDue.Value,
                        PdfAvailable = invoice.PdfAvailable,
                        InvoiceDate = invoice.InvoiceDate != null ? (DateTime?)invoice.InvoiceDate : null,
                    } by new AccountFactory.AccountKey
                    {
                        StreamConnectCustomerId = globalCustomerId,
                        StreamConnectAccountId = (Guid)invoice.GlobalAccountId,
                        AccountNumber = invoice.SystemOfRecordAccountNumber,
                        AccountType = invoice.ServiceType,
                        SystemOfRecord = invoice.SystemOfRecord
                    },
                    (account, invoices) => {
                        InvoiceExtensionAccountCapability capability;
                        account.Invoices = invoices.ToArray();
                        if (account.TryGetCapability(out capability))
                        {
                            capability.CanRequestExtension = false;
                        }
                        else
                        {
                            account.Capabilities.Add(new InvoiceExtensionAccountCapability { CanRequestExtension = false });
                        }
                    });
            }
            else
            {
                return Enumerable.Empty<Account>();
            }
        }

        async Task<Uri> IAccountService.GetInvoicePdf(Account account, Invoice invoice)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString() + "/invoices/" + invoice.InvoiceNumber);
            response.EnsureSuccessStatusCode();
            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return new Uri((string)data.Uri + "?" + sharedAccessSignature);
        }

        async Task<IEnumerable<Account>> IAccountService.GetAccountBalances(Guid globalCustomerId, IEnumerable<Account> existingAccountObjects, bool forceRefresh)
        {
            var service = ((IAccountService)this);
            List<Account> results = new List<Account>();
            foreach (var entry in from account in existingAccountObjects ?? await service.GetAccounts(globalCustomerId)
                                  select new { service, account })
            {
                if (entry.account.Balance == null || forceRefresh)
                {
                    await service.GetAccountDetails(entry.account, true);
                }
                results.Add(entry.account);
            }
            return results.ToArray();
        }

        string IAccountService.GetIgniteAssociateFromCustomerNumber(string Auth_ID, string Auth_PW, string customerNumber)
        {
            var response = dpiLinkService.Stream_GetSponsor(Auth_ID, Auth_PW, customerNumber);
            return response.SponsorNumber;
        }

        Legacy.CustomerAccount IAccountService.RetrieveIgniteAssociateContactInfo(string Auth_ID, string Auth_PW, string IA_Number)
        {
            var response = dpiLinkService.Stream_RetrieveIaContactInfo(Auth_ID, Auth_PW, IA_Number);
            var contactInfo = response.RetrieveIaContactInfo;

            return new Legacy.CustomerAccount()
            {
                Name = new DomainModels.Name()
                {
                    First = contactInfo.Name_First,
                    Last = contactInfo.Name_Last,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Primary,
                },
                Work = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Work,
                },
                Cell = new DomainModels.Phone()
                {
                    Number = contactInfo.Phone_Cell,
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = contactInfo.Street,
                    Line2 = contactInfo.Street2,
                    City = contactInfo.City,
                    StateAbbreviation = contactInfo.State,
                    PostalCode5 = contactInfo.Zip,
                },
                Email = new DomainModels.Email()
                {
                    Address = contactInfo.Email,
                },
            };
        }

        Legacy.CustomerAccount IAccountService.GetCisAccountsByUtilityAccountNumber(string utilityAccountNumber, string customerPin, string cisOfRecord)
        {
            var response = accountService.getCisAccountsByUtilityAccountNumber(new StreamCommons.Account.getCisAccountsByUtilityAccountNumberRequest1()
                {
                    GetCisAccountsByUtilityAccountNumberRequest = new StreamCommons.Account.GetCisAccountsByUtilityAccountNumberRequest()
                    {
                        utilityAccountNumber = utilityAccountNumber,
                        customerPin = customerPin,
                        cisOfRecord = cisOfRecord,
                    },
                });
            var account = response.GetCisAccountsByUtilityAccountNumberResponse1.FirstOrDefault();

            return new Legacy.CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                Name = new DomainModels.Name()
                {
                    First = account.firstName,
                    Last = account.lastName,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = account.primaryPhone,
                },
                Email = new DomainModels.Email()
                {
                    Address = account.emailAddress
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = account.billingAddress.street,
                    Line2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }

        Legacy.CustomerAccount IAccountService.GetCisAccountsByCisAccountNumber(string cisAccountNumber, string customerPin, string cisOfRecord)
        {
            var response = accountService.getCisAccountsByCisAccountNumber(new StreamCommons.Account.getCisAccountsByCisAccountNumberRequest1()
                {
                    GetCisAccountsByCisAccountNumberRequest = new StreamCommons.Account.GetCisAccountsByCisAccountNumberRequest()
                    {
                        cisAccountNumber = cisAccountNumber,
                        customerPin = customerPin,
                        cisOfRecord = cisOfRecord,
                    },
                });
            var account = response.GetCisAccountsByCisAccountNumberResponse1.FirstOrDefault();

            return new Legacy.CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                Name = new DomainModels.Name()
                {
                    First = account.firstName,
                    Last = account.lastName,
                },
                Primary = new DomainModels.Phone()
                {
                    Number = account.primaryPhone,
                },
                Email = new DomainModels.Email()
                {
                    Address = account.emailAddress,
                },
                BillingAddress = new DomainModels.Address()
                {
                    Line1 = account.billingAddress.street,
                    Line2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }


        async Task<Customer> IAccountService.CreateStreamConnectCustomer(string providerKey, string email, string username)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers", new { PortalId = providerKey, EmailAddress = email, UserName = username });
            if (response.IsSuccessStatusCode)
            {
                var data = Json.Read<StreamConnect.CustomerResponse>(await response.Content.ReadAsStringAsync());
                return new Customer
                {
                    GlobalCustomerId = data.Customer.GlobalCustomerId,
                    EmailAddress = data.Customer.EmailAddress,
                    AspNetUserProviderKey = data.Customer.PortalId,
                    Username = data.Customer.UserName,
                };
            }
            else
            {
                return null;
            }
        }

        async Task<Customer> IAccountService.GetCustomerByCustomerId(Guid globalCustomerId)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString());
            if (response.IsSuccessStatusCode)
            {
                var data = Json.Read<StreamConnect.CustomerResponse>(await response.Content.ReadAsStringAsync());
                return new Customer
                {
                    GlobalCustomerId = globalCustomerId,
                    EmailAddress = data.Customer.EmailAddress,
                    AspNetUserProviderKey = data.Customer.PortalId,
                    Username = data.Customer.UserName,
                };
            }
            return null;
        }

        async Task<bool> IAccountService.UpdateCustomer(Customer customer)
        {
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1/customers/" + customer.GlobalCustomerId.ToString(),
                new
                {
                    EmailAddress = customer.EmailAddress,
                    UserName = customer.Username,
                    PortalId = customer.AspNetUserProviderKey,
                    TCPAPreference = "NA"
                });
            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return ((string)data.Status.ToString()) == "Success";
        }

        async Task<IEnumerable<Customer>> IAccountService.FindCustomers(string emailAddress)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers?EmailAddress=" + emailAddress);
            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return ParseFindCustomers(data);
        }

        async Task<IEnumerable<Customer>> IAccountService.FindCustomersByCisAccount(string accountNumber)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers?SystemOfRecordAccountNumber=" + accountNumber);
            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return ParseFindCustomers(data);
        }

        private static IEnumerable<Customer> ParseFindCustomers(dynamic data)
        {
            if (data.Status != "Success")
                return null;

            return from entry in (IEnumerable<dynamic>)data.Customers
                   select new Customer
                   {
                       GlobalCustomerId = entry.GlobalCustomerId,
                       EmailAddress = entry.EmailAddress,
                       AspNetUserProviderKey = entry.PortalId,
                       Username = entry.UserName,
                   };
        }


        async Task<IEnumerable<Account>> IAccountService.GetAccounts(Guid globalCustomerId)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/accounts");
            if (response.IsSuccessStatusCode)
            {
                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    var result = new List<Account>();
                    foreach (var acct in data.Accounts)
                    {
                        result.Add(new Account(globalCustomerId, (Guid)acct.GlobalAccountId)
                            {
                                AccountNumber = acct.SystemOfRecordAccountNumber,
                                AccountType = acct.ServiceType,
                                SystemOfRecord = acct.SystemOfRecord,
                            });
                    }
                    return result.ToArray();
                }
            }
            return null;
        }

        async Task<Account> IAccountService.AssociateAccount(Guid globalCustomerId, string accountNumber, string ssnLast4, string accountNickname)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers/" + globalCustomerId.ToString() + "/accounts/associate", new
                {
                    AccountNumber = accountNumber,
                    Last4 = ssnLast4 == null ? "0000" : ssnLast4,
                    IgnoreLast4 = ssnLast4 == null ? true : false,
                    Nickname = accountNickname
                });
            if (response.IsSuccessStatusCode)
            {
                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    var associated = ((IEnumerable<dynamic>)data.AssociateAccountResults).FirstOrDefault(a => a.Status == "Success");
                    if (associated != null)
                    {
                        return new Account(globalCustomerId, Guid.Parse((string)associated.GlobalAccountId))
                            {
                                AccountNumber = accountNumber
                            };
                    }
                }
            }
            return null;
        }

        async Task<bool> IAccountService.DisassociateAccount(Account account)
        {
            var response = await streamConnectClient.DeleteAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString());

            if (response.IsSuccessStatusCode)
            {
                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    return true;
                }
            }
            return false;
        }

        

        #region GetAccountDetails

        async Task<bool> IAccountService.GetAccountDetails(Account account, bool forceRefresh)
        {
            if (account.Details == null || forceRefresh)
            {
                var response = await streamConnectClient.GetAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString());

                if (response.IsSuccessStatusCode)
                {
                    dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                    if (data.Status == "Success")
                    {
                        LoadAccountDetailsFromStreamConnect(account, data);
                        return true;
                    }
                    return false;
                }
            }
            return true;
        }

        async Task<Account> IAccountService.GetAccountDetails(string accountNumber, string last4)
        {
            if (cis2AureaAccountMapping.ContainsKey(accountNumber))
            {
                accountNumber = cis2AureaAccountMapping[accountNumber];
            }
            
            var response = await streamConnectClient.GetAsync("/api/v1/accounts/find?systemOfRecordAccountNumber=" + accountNumber + (!string.IsNullOrEmpty(last4) ? "&last4Ssn=" + last4 : ""));

            if (response.IsSuccessStatusCode)
            {
                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    var account = accountFactory.CreateAccount(new AccountFactory.AccountKey());
                    LoadAccountDetailsFromStreamConnect(account, data);
                    if (!account.SubAccounts.Any(a => a != null))
                    {
                        return null;
                    }

                    return account;
                }
            }
            return null;
        }

        private void LoadAccountDetailsFromStreamConnect(Account account, dynamic data)
        {
            var homePhone = (data.Account.AccountCustomer.HomePhone.Value.ToString() == null ? null : new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = data.Account.AccountCustomer.HomePhone.Value.ToString() });
            var mobilePhone = (data.Account.AccountCustomer.MobilePhone.Value.ToString() == null ? null : new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Mobile, Number = data.Account.AccountCustomer.MobilePhone.Value.ToString() });
            var tcpa = (data.TCPAPreference == "NA" ? (bool?)null : (bool?)(data.TCPAPreference == "Yes"));
            if (data.Account.ServiceType == "Mobile")
            {
                account.Details = new MobileAccountDetails()
                {
                    NextBillDate = (DateTime)data.Account.AccountDetails.NextBillDate,
                    LastBillDate = (DateTime)data.Account.AccountDetails.LastBillDate,
                };
                account.AccountType = data.Account.ServiceType;
            }
            else
            {
                account.Details = new AccountDetails();
            }
            account.Details.ContactInfo = new DomainModels.CustomerContact
            {
                Name = new DomainModels.Name { First = data.Account.AccountCustomer.FirstName, Last = data.Account.AccountCustomer.LastName },
                Email = new DomainModels.Email { Address = data.Account.AccountCustomer.EmailAddress },
                Phone = new DomainModels.Phone[] 
                                { 
                                    homePhone,
                                    mobilePhone,
                                }.Where(p => p != null).ToArray()
            };
            account.Details.BillingAddress = new DomainModels.Address
            {
                Line1 = data.Account.AccountBillingDetails.BillingAddress.StreetLine1,
                Line2 = data.Account.AccountBillingDetails.BillingAddress.StreetLine2,
                City = data.Account.AccountBillingDetails.BillingAddress.City,
                PostalCode5 = data.Account.AccountBillingDetails.BillingAddress.Zip,
                StateAbbreviation = data.Account.AccountBillingDetails.BillingAddress.State,
            };
            account.Details.SsnLastFour = ((object)data.Account.AccountCustomer.CustomerLast4).ToString().PadLeft(4, '0');
            account.Details.TcpaPreference = tcpa;
            account.Details.BillingDeliveryPreference = data.Account.AccountBillingDetails.BillDeliveryTypePreference;

            account.SystemOfRecord = data.Account.SystemOfRecord;
            account.AccountNumber = data.Account.SystemOfRecordAccountNumber;
            account.Balance = new AccountBalance
            {
                Balance = (decimal)data.Account.AccountBillingDetails.BalanceDue.Value,
                DueDate = (DateTime)data.Account.AccountBillingDetails.BalanceDueDate.Value,
            };
            account.SubAccounts = (from premise in (IEnumerable<dynamic>)(data.Account.AccountDetails.Premises ?? data.Account.AccountDetails.Devices)
                                   select (ISubAccount)CreateSubAccount(premise)).ToArray();
            
            var methodId = data.Account.AccountBillingDetails.AutoPayGlobalPaymentMethodId == null ? Guid.Empty : Guid.Parse(data.Account.AccountBillingDetails.AutoPayGlobalPaymentMethodId.ToString());
            account.AutoPay = new DomainModels.Payments.AutoPaySetting
            {
                IsEnabled = methodId != Guid.Empty,
                PaymentMethodId = methodId
            };

            account.Capabilities.RemoveAll(cap => cap is ExternalPaymentAccountCapability || cap is PaymentMethodAccountCapability || cap is PaymentSchedulingAccountCapability);
            account.Capabilities.Add(new ExternalPaymentAccountCapability
            {
                UtilityProvider = null, //TODO - Needed for NE accounts
            });
            account.Capabilities.Add(new PaymentMethodAccountCapability
            {
                AvailablePaymentMethods = 
                { 
                    new AvailablePaymentMethod { PaymentMethodType = DomainModels.Payments.TokenizedBank.Qualifier }, 
                    new AvailablePaymentMethod { PaymentMethodType = DomainModels.Payments.TokenizedCard.Qualifier }
                }
            });
            account.Capabilities.Add(new PaymentSchedulingAccountCapability
            {
                CanMakeOneTimePayment = true
            });
        }

        private ISubAccount CreateSubAccount(dynamic details)
        {
            var serviceAddress = details.ServiceAddress != null ? new DomainModels.Address
                            {
                                Line1 = details.ServiceAddress.StreetLine1,
                                Line2 = details.ServiceAddress.StreetLine2,
                                City = details.ServiceAddress.City,
                                PostalCode5 = details.ServiceAddress.Zip,
                                StateAbbreviation = details.ServiceAddress.State,
                            } : new DomainModels.Address();

            var locAdapter = locationAdapters.FirstOrDefault(adapter => adapter.IsFor(serviceAddress, (string)details.ProductType));

            if (locAdapter == null)
                return null;

            return locAdapter.BuildSubAccount(serviceAddress, details);
        }

        #endregion

        async Task<bool> IAccountService.SetAccountDetails(Account account, AccountDetails details)
        {
            var response = await streamConnectClient.PutAsJsonAsync("/api/v1/customers/" + account.StreamConnectCustomerId.ToString() + "/accounts/" + account.StreamConnectAccountId.ToString(),
                new
                {
                    HomePhone = details.ContactInfo.Phone.OfType<DomainModels.TypedPhone>().Where(p => p.Category == DomainModels.PhoneCategory.Home).Select(p => p.Number).FirstOrDefault(),
                    MobilePhone = details.ContactInfo.Phone.OfType<DomainModels.TypedPhone>().Where(p => p.Category == DomainModels.PhoneCategory.Mobile).Select(p => p.Number).FirstOrDefault(),
                    AccountEmailAddress = details.ContactInfo.Email != null ? details.ContactInfo.Email.Address : null,
                    Address = StreamConnectUtilities.ToStreamConnectAddress(details.BillingAddress),
                    TCPAPreference = details.TcpaPreference == null ? "NA" : (details.TcpaPreference.Value ? "Yes" : "No"),
                    BillDeliveryTypePreference = details.BillingDeliveryPreference,
                });

            if (response.IsSuccessStatusCode)
            {
                account.Details = null;

                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    return true;
                }
            }
            return false;
        }


        async Task<bool> IAccountService.CheckRenewalEligibility(Account account, ISubAccount subAccount, bool forceRefresh)
        {
            if (account.Capabilities.OfType<RenewalAccountCapability>().Any() && !forceRefresh)
            {
                return true;
            }

            if (account.Details == null)
            {
                await ((IAccountService)this).GetAccountDetails(account, false);
            }

            if (subAccount.CustomerType == EnrollmentCustomerType.Commercial)
            {
                // We don't support commercial enrollments at this time.
                account.Capabilities.Add(new RenewalAccountCapability
                {
                    IsEligible = false
                });
                return true;
            }

            var locAdapter = locationAdapters.FirstOrDefault(adapter => adapter.IsFor(subAccount));

            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/renewals/eligibility/",
                new
                {
                    UtilityAccountNumber = locAdapter.GetUtilityAccountNumber(subAccount),
                    ProductType = locAdapter.GetCommodityType(),
                    ProviderId = locAdapter.GetProvider(account.SubAccounts.First()),
                    CustomerLast4 = account.Details.SsnLastFour,
                    SystemOfRecord = account.SystemOfRecord,
                    SystemOfRecordAccountNumber = account.AccountNumber,
                });

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            account.Capabilities.RemoveAll(c => c is RenewalAccountCapability);
            if (data.Status != "Success")
            {
                return false;
            }

            account.Capabilities.Add(new RenewalAccountCapability
            {
                IsEligible = data.IsEligible,
                RenewalDate = (DateTime)data.EligibilityDate,
                EligibilityWindowInDays = (int)data.EligibilityWindow,
                Capabilities = new IServiceCapability[] { 
                    new ServiceStatusCapability { EnrollmentType = EnrollmentType.Renewal }, 
                    new CustomerTypeCapability { CustomerType = subAccount.CustomerType }, 
                    locAdapter.GetRenewalServiceCapability(account, subAccount)
                }
            });

            return true;
        }

        async Task<bool> IAccountService.GetAccountUsageDetails(Account account, DateTime startDate, DateTime endDate, bool forceRefresh)
        {
            if (account.Usage != null && !forceRefresh)
            {
                return true;
            }

            var response = await streamConnectClient.GetAsync(string.Format("api/v1/customers/{0}/accounts/{1}/usage?startDate={2}&endDate={3}", account.StreamConnectCustomerId.ToString(), account.StreamConnectAccountId.ToString(), startDate.ToString(), endDate.ToString()));

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            if (data.Status != "Success")
            {
                return false;
            }

            account.Usage = (from usage in (IEnumerable<dynamic>)data.UsageDetail
                             select new KeyValuePair<ISubAccount, AccountUsage>(CreateSubAccount(usage.Device), new MobileAccountUsage()
                             {
                                 StartDate = (DateTime)usage.StartDate,
                                 EndDate = (DateTime)usage.EndDate,
                                 DataUsage = (decimal)usage.DataUsage,
                                 MessagesUsage = (decimal)usage.MessagesUsage,
                                 MinutesUsage = (decimal)usage.MinutesUsage,
                             })).ToDictionary(kvp => kvp.Key, kvp => kvp.Value);

            return true;
        }

        async Task<bool> IAccountService.ChangePlan(Account account, string oldPlanId, string newPlanId, string newChildPlanId)
        {
            var response = await streamConnectClient.PostAsJsonAsync(string.Format("/api/v1/customers/{0}/accounts/{1}/changePlan", account.StreamConnectCustomerId.ToString(), account.StreamConnectAccountId.ToString()),
                new
                {
                    OldToNewPlanIds = (from subAcct in account.SubAccounts
                                      let phone = subAcct as MobileAccount
                                      where phone.PlanId == oldPlanId || phone.ParentGroupProductId == oldPlanId
                                      select new KeyValuePair<string, string>(phone.PlanId, phone.PlanId == oldPlanId ? newPlanId : newChildPlanId)).Distinct().ToDictionary(k => k.Key, k => k.Value),
                });

            if (!response.IsSuccessStatusCode)
            {
                return false;
            }

            dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());

            return (data.Status == "Success");
        }
    }
}
