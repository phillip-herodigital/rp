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
        private readonly Services.Clients.IAccountService accountService;

        public AccountController(HttpSessionStateBase session, Services.Clients.IAccountService accountService, Services.Clients.ITemperatureService temperatureService)
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
        public Table<Invoice> Invoices(bool schema = true)
        {
            return new Table<Invoice>
                {
                    ColumnList = schema ? typeof(Invoice).BuildTableSchema() : null,
                    Values = from invoice in accountService.GetInvoices(User.Identity.Name)
                             select new Invoice
                             {
                                 AccountNumber = "1197015532",
                                 ServiceType = "HomeLife Services",
                                 InvoiceNumber = "1030523546381",
                                 InvoiceAmount = "24.99",
                                 DueDate = "04/05/2014",
                                 IsPaid = false,
                                 CanRequestExtension = true,
                                 Actions = 
                                 {
                                     { "viewPdf", "http://.../" }
                                 }
                             }
                };
        }
    }
}