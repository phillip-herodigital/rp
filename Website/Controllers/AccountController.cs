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
        private Services.Clients.ITemperatureService temperatureService;

        public AccountController(HttpSessionStateBase session, Services.Clients.ITemperatureService temperatureService)
        {
            this.temperatureService = temperatureService;
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
                    Values = new[] { 
                        new Invoice
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
		                },
                        new Invoice
		                {
			                AccountNumber = "219849302",
			                ServiceType = "Utility",
			                InvoiceNumber = "1020453546012",
			                InvoiceAmount = "93.72",
			                DueDate = "04/03/2014",
			                IsPaid = false,
			                CanRequestExtension = false
		                },
                        new Invoice
		                {
			                AccountNumber = "194829927",
			                ServiceType = "Utility",
			                InvoiceNumber = "1030523546381",
			                InvoiceAmount = "52.24",
			                DueDate = "04/01/2014",
			                IsPaid = false,
			                CanRequestExtension = false
		                },
                        new Invoice
		                {
			                AccountNumber = "1197015532",
			                ServiceType = "HomeLife Services",
			                InvoiceNumber = "1030523546381",
			                InvoiceAmount = "24.99",
			                DueDate = "03/05/2014",
			                IsPaid = true,
			                CanRequestExtension = true
		                },
                                       new Invoice
		                {
			                AccountNumber = "219849302",
			                ServiceType = "Utility",
			                InvoiceNumber = "1020453546012",
			                InvoiceAmount = "93.72",
			                DueDate = "03/03/2014",
			                IsPaid = true,
			                CanRequestExtension = false
		                },
                        new Invoice
		                {
			                AccountNumber = "194829927",
			                ServiceType = "Utility",
			                InvoiceNumber = "1030523546381",
			                InvoiceAmount = "52.24",
			                DueDate = "03/01/2014",
			                IsPaid = true,
			                CanRequestExtension = false
		                },
                        new Invoice
		                {
			                AccountNumber = "1197015532",
			                ServiceType = "HomeLife Services",
			                InvoiceNumber = "1030523546381",
			                InvoiceAmount = "24.99",
			                DueDate = "02/05/2014",
			                IsPaid = true,
			                CanRequestExtension = true
		                },
                        new Invoice
		                {
			                AccountNumber = "219849302",
			                ServiceType = "Utility",
			                InvoiceNumber = "1020453546012",
			                InvoiceAmount = "93.72",
			                DueDate = "02/03/2014",
			                IsPaid = true,
			                CanRequestExtension = false
		                },
                        new Invoice
		                {
			                AccountNumber = "194829927",
			                ServiceType = "Utility",
			                InvoiceNumber = "1030523546381",
			                InvoiceAmount = "52.24",
			                DueDate = "02/01/2014",
			                IsPaid = true,
			                CanRequestExtension = false
		                }
                    }
                };
        }
    }
}