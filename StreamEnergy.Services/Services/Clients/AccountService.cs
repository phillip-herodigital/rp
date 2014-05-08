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

        public AccountService(Sample.Commons.SampleStreamCommonsSoap service)
        {
            this.service = service;
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
    }
}
