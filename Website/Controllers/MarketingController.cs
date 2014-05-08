using StreamEnergy.MyStream.Models.Marketing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class MarketingController : Controller
    {
        public ActionResult HomeLifeServices(string mock)
        {
            HomeLifeServices model = null;

            if (mock == "test")
            {
                model = new HomeLifeServices()
                {
                    PostUrl = "/",
                    ClientID = "ClientID",
                    CampaignName = "CampaignName",
                    CustomerNumber = "CustomerNumber",
                    FirstName = "FirstName",
                    LastName = "LastName",
                    Address1 = "Address1",
                    Address2 = "Address2",
                    City = "City",
                    State = "State",
                    ZipCode = "ZipCode",
                    Phone1 = "Phone1",
                    Phone2 = "Phone2",
                    Phone3 = "Phone3",
                    RepId = "RepId",
                    RepFirstName = "RepFirstName",
                    RepLastName = "RepLastName",
                    RepEmail = "RepEmail",
                };
            }

            return View("~/Views/Pages/Marketing/Services/HomeLife Services.cshtml", model);
        }
	}
}