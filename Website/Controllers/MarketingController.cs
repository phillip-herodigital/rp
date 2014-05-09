using StreamEnergy.DomainModels.Accounts;
using StreamEnergy.MyStream.Models.Marketing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class MarketingController : Controller
    {
        private Services.Clients.IAccountService accountService;
        public MarketingController(Services.Clients.IAccountService accountService)
        {
            this.accountService = accountService;
        }
        public ActionResult HomeLifeServices(string hash, string mock)
        {
            HomeLifeServices model = new HomeLifeServices();

            // how do we know if we are in production?
            model.PostUrl = "https://streamvalues.com.st1.ocenture.com/buy";

            if (!string.IsNullOrEmpty(hash))
            {
                var hashValues = new Dictionary<string, string>();
                var parts = Encoding.UTF8.GetString(Convert.FromBase64String(hash)).Split(new string[] { "|" }, StringSplitOptions.RemoveEmptyEntries);
                foreach (var part in parts)
                {
                    var pair = part.Split(new string[] { "=" }, StringSplitOptions.RemoveEmptyEntries);
                    if (pair.Length == 2)
                    {
                        hashValues[pair[0]] = pair[1];
                    }
                }

                CustomerAccount customerAccount = null;

                try
                {
                    if (hashValues["RefSite"] == "PowerCenter")
                    {
                        customerAccount = accountService.RetrieveIgniteAssociateContactInfo("Ignite", "3t8sh8f3sg", hashValues["IgniteAssociate"]);
                    }
                    else if (new string[] { "MyStreamEnroll", "MyIgniteEnroll" }.Contains(hashValues["RefSite"]))
                    {
                        customerAccount = accountService.GetCisAccountsByUtilityAccountNumber(hashValues["CamelotAccountNumber"], hashValues["Last4Ssn"], "");
                    }
                    else if (new string[] { "MyStreamRenew", "MyIgniteRenew", "IstaNetEnroll", "NEWelcomeEmail", "KubraMyAccount" }.Contains(hashValues["RefSite"]))
                    {
                        customerAccount = accountService.GetCisAccountsByCisAccountNumber(hashValues["CISCustomerNumber"], hashValues["Last4Ssn"], "");
                    }
                }
                catch(Exception)
                {
                    // do nothing? Maybe log this?
                }

                if (customerAccount != null)
                {
                    model.CustomerAccount = customerAccount;
                    model.RepId = hashValues["IgniteAssociate"];
                }

                if (string.IsNullOrEmpty(model.RepId) && !string.IsNullOrEmpty(model.CustomerAccount.CisAccountNumber))
                {
                    model.RepId = accountService.GetIgniteAssociateFromCustomerNumber("Ignite", "3t8sh8f3sg", model.CustomerAccount.CisAccountNumber);
                }
            }

            return View("~/Views/Pages/Marketing/Services/HomeLife Services.cshtml", model);
        }
	}
}