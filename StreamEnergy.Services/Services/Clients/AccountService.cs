using StreamEnergy.DomainModels.Accounts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class AccountService : IAccountService
    {
        private Sample.Commons.SampleStreamCommonsSoap service;
        private StreamCommons.Account.CisAccountServicesPortType accountService;
        private StreamEnergy.DPI.DPILinkSoap dpiLinkService;

        public AccountService(Sample.Commons.SampleStreamCommonsSoap service, StreamCommons.Account.CisAccountServicesPortType accountService, StreamEnergy.DPI.DPILinkSoap dpiLinkService)
        {
            this.service = service;
            this.accountService = accountService;
            this.dpiLinkService = dpiLinkService;
        }

        IEnumerable<DomainModels.Accounts.Invoice> IAccountService.GetInvoices(string username)
        {
            var response = service.GetInvoices(new Sample.Commons.GetInvoicesRequest { Username = username });

            return from entry in response.Invoice
                   select new DomainModels.Accounts.Invoice
                   {
                       AccountNumber = entry.AccountNumber,
                       CanRequestExtension = entry.CanRequestExtension,
                       DueDate = entry.DueDate,
                       InvoiceAmount = entry.InvoiceAmount,
                       InvoiceNumber = entry.InvoiceNumber,
                       IsPaid = entry.IsPaid,
                       ServiceType = entry.ServiceType
                   };
        }

        string IAccountService.GetIgniteAssociateFromCustomerNumber(string Auth_ID, string Auth_PW, string customerNumber)
        {
            var response = dpiLinkService.Stream_GetSponsor(Auth_ID, Auth_PW, customerNumber);
            return response.SponsorNumber;
        }

        CustomerAccount IAccountService.RetrieveIgniteAssociateContactInfo(string Auth_ID, string Auth_PW, string IA_Number)
        {
            var response = dpiLinkService.Stream_RetrieveIaContactInfo(Auth_ID, Auth_PW, IA_Number);
            var contactInfo = response.RetrieveIaContactInfo;

            return new CustomerAccount()
            {
                FirstName = contactInfo.Name_First,
                LastName = contactInfo.Name_Last,
                PrimaryPhone = contactInfo.Phone_Primary,
                WorkPhone = contactInfo.Phone_Work,
                CellPhone = contactInfo.Phone_Cell,
                BillingAddress = new DomainModels.Address()
                {
                    AddressLine1 = contactInfo.Street,
                    AddressLine2 = contactInfo.Street2,
                    City = contactInfo.City,
                    StateAbbreviation = contactInfo.State,
                    PostalCode5 = contactInfo.Zip,
                },
            };
        }

        CustomerAccount IAccountService.GetCisAccountsByUtilityAccountNumber(string utilityAccountNumber, string customerPin, string cisOfRecord)
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

            return new CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                FirstName = account.firstName,
                LastName = account.lastName,
                PrimaryPhone = account.primaryPhone,
                EmailAddress = account.emailAddress,
                BillingAddress = new DomainModels.Address()
                {
                    AddressLine1 = account.billingAddress.street,
                    AddressLine2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }

        CustomerAccount IAccountService.GetCisAccountsByCisAccountNumber(string cisAccountNumber, string customerPin, string cisOfRecord)
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

            return new CustomerAccount()
            {
                CisAccountNumber = account.cisAccountNumber,
                CamelotAccountNumber = account.camelotAccountNumber,
                Commodity = account.commodity,
                FirstName = account.firstName,
                LastName = account.lastName,
                PrimaryPhone = account.primaryPhone,
                EmailAddress = account.emailAddress,
                BillingAddress = new DomainModels.Address()
                {
                    AddressLine1 = account.billingAddress.street,
                    AddressLine2 = account.billingAddress.street2,
                    City = account.billingAddress.city,
                    PostalCode5 = account.billingAddress.zipcode,
                    StateAbbreviation = account.billingAddress.state,
                },
            };
        }
    }
}
