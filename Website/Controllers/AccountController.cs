using StreamEnergy.MyStream.Models;
using StreamEnergy.MyStream.Models.Account;
using StreamEnergy.MyStream.Models.Angular.GridTable;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.SessionState;

namespace StreamEnergy.MyStream.Controllers
{
    public class AccountController : ApiController, IRequiresSessionState
    {
        private readonly Services.Clients.ITemperatureService temperatureService;
        private readonly DomainModels.Accounts.IAccountService accountService;

        public AccountController(HttpSessionStateBase session, DomainModels.Accounts.IAccountService accountService, Services.Clients.ITemperatureService temperatureService)
        {
            this.temperatureService = temperatureService;
            this.accountService = accountService;
        }

        [HttpGet]
        public string CelciusToFahrenheit(string celcius)
        {
            return temperatureService.CelciusToFahrenheit(celcius: celcius);
        }


        /// <summary>
        /// Gets all the client data, such as for a page refresh
        /// </summary>
        /// <returns></returns>
        [HttpGet]
        [Caching.CacheControl(MaxAgeInMinutes = 0)]
        public Table<Invoice> Invoices(bool schema = true)
        {
            return new Table<Invoice>
                {
                    // TODO - provide translation sitecore item
                    ColumnList = schema ? typeof(Invoice).BuildTableSchema(null) : null,
                    Values = from invoice in accountService.GetInvoices(User.Identity.Name)
                             select new Invoice
                             {
                                 AccountNumber = invoice.AccountNumber,
                                 ServiceType = invoice.ServiceType,
                                 InvoiceNumber = invoice.InvoiceNumber,
                                 InvoiceAmount = invoice.InvoiceAmount.ToString("0.00"),
                                 DueDate = invoice.DueDate.ToShortDateString(),
                                 IsPaid = invoice.IsPaid,
                                 CanRequestExtension = invoice.CanRequestExtension,
                                 Actions = 
                                 {
                                     { "viewPdf", "http://.../" }
                                 }
                             }
                };
        }
    }
}