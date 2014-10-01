using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Practices.Unity;
using System.Net.Http;
using Legacy = StreamEnergy.DomainModels.Accounts.Legacy;

namespace StreamEnergy.Services.Clients
{
    class AccountService : IAccountService
    {
        private readonly Sample.Commons.SampleStreamCommonsSoap service;
        private readonly StreamCommons.Account.CisAccountServicesPortType accountService;
        private readonly StreamEnergy.Dpi.DPILinkSoap dpiLinkService;
        private readonly HttpClient streamConnectClient;
        private readonly string sharedAccessSignature;
        private readonly AccountFactory accountFactory;

        public AccountService(Sample.Commons.SampleStreamCommonsSoap service, StreamCommons.Account.CisAccountServicesPortType accountService, StreamEnergy.Dpi.DPILinkSoap dpiLinkService, [Dependency(StreamConnectContainerSetup.StreamConnectKey)] HttpClient client, [Dependency(StreamConnectContainerSetup.StreamConnectSharedAccessSignature)] string sharedAccessSignature, AccountFactory accountFactory)
        {
            this.service = service;
            this.accountService = accountService;
            this.dpiLinkService = dpiLinkService;
            this.streamConnectClient = client;
            this.sharedAccessSignature = sharedAccessSignature;
            this.accountFactory = accountFactory;
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
                    } by new AccountFactory.AccountKey
                    {
                        StreamConnectCustomerId = globalCustomerId,
                        StreamConnectAccountId = (Guid)invoice.GlobalAccountId,
                        AccountNumber = invoice.SystemOfRecordAccountNumber,
                        AccountType = invoice.ServiceType,
                        SystemOfRecord = invoice.SystemOfRecord
                    },
                    (account, invoices) => account.Invoices = invoices.ToArray());
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

        Task<IEnumerable<Account>> IAccountService.GetCurrentInvoices(Guid globalCustomerId)
        {
            // TODO - load from Stream Commons
            return Task.FromResult<IEnumerable<Account>>(new[] {
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "1234567890", 
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(2), InvoiceAmount = 73.05m, InvoiceNumber="" },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true }  , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } }
                    }
                },
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "5678901234",
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(12), InvoiceAmount = 24.95m, InvoiceNumber="" }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
                new Account(globalCustomerId, Guid.Empty) { 
                    AccountNumber = "2345060992", 
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(19), InvoiceAmount = 54.05m, InvoiceNumber="" }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = false }, 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "3429500293",
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(29), InvoiceAmount = 36.00m, InvoiceNumber="" }, 
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } ,
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } } 
                    } 
                },
            });
        }

        Task<IEnumerable<Account>> IAccountService.GetAccountBalances(Guid globalCustomerId)
        {
            // TODO - load from Stream Commons
            return Task.FromResult<IEnumerable<Account>>(new[] {
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "1234567890", 
                    Balance = new AccountBalance { Balance = 0.00m, DueDate = DateTime.Today.AddDays(2) },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } },
                        new ExternalPaymentAccountCapability { }
                    }
                },
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "5678901234",
                    Balance = new AccountBalance { Balance =  24.95m, DueDate = DateTime.Today.AddDays(12) },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } , 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } },
                        new ExternalPaymentAccountCapability { } 
                    } 
                },
                new Account(globalCustomerId, Guid.Empty) { 
                    AccountNumber = "2345060992", 
                    Balance = new AccountBalance { Balance =  54.05m, DueDate = DateTime.Today.AddDays(19) },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = false }, 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } },
                        new ExternalPaymentAccountCapability { } 
                    } 
                },
                new Account(globalCustomerId, Guid.Empty) {
                    AccountNumber = "3429500293",
                    Balance = new AccountBalance { Balance =  36.00m, DueDate = DateTime.Today.AddDays(29) },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true } ,
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } },
                        new ExternalPaymentAccountCapability { UtilityProvider = "PECO" }
                    } 
                },
            });
        }

        Task<Account> IAccountService.GetCurrentInvoice(string accountNumber)
        {
            // TODO - load from Stream Commons
            return Task.FromResult<Account>(
                new Account(Guid.Empty, Guid.Empty)
                {
                    AccountNumber = accountNumber,
                    CurrentInvoice = new Invoice { DueDate = DateTime.Today.AddDays(2), InvoiceAmount = 123.45m, InvoiceNumber="" },
                    Capabilities = { 
                        new PaymentSchedulingAccountCapability { CanMakeOneTimePayment = true }, 
                        new PaymentMethodAccountCapability { AvailablePaymentMethods = { new AvailablePaymentMethod { PaymentMethodType = StreamEnergy.DomainModels.Payments.TokenizedCard.Qualifier } } }
                    }
                }
            );
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


        async Task<Guid> IAccountService.CreateStreamConnectCustomer(string username, string email)
        {
            var response = await streamConnectClient.PostAsJsonAsync("/api/v1/customers", new { PortalId = username, EmailAddress = email });
            if (response.IsSuccessStatusCode)
            {
                var data = Json.Read<StreamConnect.CustomerResponse>(await response.Content.ReadAsStringAsync());
                return data.Customer.GlobalCustomerId;
            }
            else
            {
                return Guid.Empty;
            }
        }

        async Task<string> IAccountService.GetEmailByCustomerId(Guid globalCustomerId)
        {
            var response = await streamConnectClient.GetAsync("/api/v1/customers/" + globalCustomerId.ToString());
            if (response.IsSuccessStatusCode)
            {
                var data = Json.Read<StreamConnect.CustomerResponse>(await response.Content.ReadAsStringAsync());
                return data.Customer.EmailAddress;
            }
            return null;
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
                    Last4 = ssnLast4,
                    Nickname = accountNickname
                });
            if (response.IsSuccessStatusCode)
            {
                dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
                if (data.Status == "Success")
                {
                    return new Account(globalCustomerId, Guid.Parse((string)data.AssociateAccountResults[0].GlobalAccountId))
                        {
                            AccountNumber = accountNumber
                        };
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
                        account.Details = new AccountDetails
                            {
                                ContactInfo = new DomainModels.CustomerContact
                                {
                                    Name = new DomainModels.Name { First = data.AccountDetails.AccountCustomer.FirstName, Last = data.AccountDetails.AccountCustomer.LastName },
                                    Email = new DomainModels.Email { Address = data.AccountDetails.AccountCustomer.EmailAddress },
                                    Phone = new DomainModels.Phone[] 
                                    { 
                                        (data.AccountDetails.AccountCustomer.HomePhone.Value.ToString() == null ? null : new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Home, Number = data.AccountDetails.AccountCustomer.HomePhone.Value.ToString() }),
                                        (data.AccountDetails.AccountCustomer.MobilePhone.Value.ToString() == null ? null : new DomainModels.TypedPhone { Category = DomainModels.PhoneCategory.Mobile, Number = data.AccountDetails.AccountCustomer.HomePhone.Value.ToString() }),
                                    }.Where(p => p != null).ToArray()
                                },
                                BillingAddress = new DomainModels.Address
                                {
                                    Line1 = data.AccountDetails.BillingAddress.StreetLine1,
                                    Line2 = data.AccountDetails.BillingAddress.StreetLine1,
                                    City = data.AccountDetails.BillingAddress.City,
                                    PostalCode5 = data.AccountDetails.BillingAddress.Zip,
                                    StateAbbreviation = data.AccountDetails.BillingAddress.State,
                                },
                                // TODO - are there other parts that belong here?
                            };
                        return true;
                    }
                    return false;
                }
            }
            return true;
        }

        Task<bool> IAccountService.SetAccountDetails(Account account, AccountDetails details)
        {
            throw new NotImplementedException();
            //var response = await streamConnectClient.PostAsJsonAsync("/api/v1/accounts/update/" + account.StreamConnectAccountId.ToString() + "/accounts/" + account.StreamConnectCustomerId.ToString(),
            //    new
            //    {
            //        PrimaryPhoneNumber = 
            //    });

            //if (response.IsSuccessStatusCode)
            //{
            //    dynamic data = Json.Read<Newtonsoft.Json.Linq.JObject>(await response.Content.ReadAsStringAsync());
            //    if (data.Status == "Success")
            //    {
            //        account.Details = new AccountDetails
            //        {
            //            ContactInfo = new DomainModels.CustomerContact
            //            {
            //                Name = new DomainModels.Name { First = data.AccountDetails.AccountCustomer.FirstName, Last = data.AccountDetails.AccountCustomer.LastName },
            //                Email = new DomainModels.Email { Address = data.AccountDetails.AccountCustomer.EmailAddress },
            //                // TODO - phone number?
            //            },
            //            BillingAddress = new DomainModels.Address
            //            {
            //                Line1 = data.AccountDetails.BillingAddress.StreetLine1,
            //                Line2 = data.AccountDetails.BillingAddress.StreetLine1,
            //                City = data.AccountDetails.BillingAddress.City,
            //                PostalCode5 = data.AccountDetails.BillingAddress.Zip,
            //                StateAbbreviation = data.AccountDetails.BillingAddress.State,
            //            },
            //            // TODO - are there other parts that belong here?
            //        };
            //        return true;
            //    }
            //}
            //return false;
        }
    }
}
