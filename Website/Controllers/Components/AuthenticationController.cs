using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class AuthenticationController : Controller
    {
        public ActionResult LoginIndex()
        {
            var model = new StreamEnergy.MyStream.Models.Authentication.LoginRequest();

            return View("~/Views/Components/Authentication/My Stream Account.cshtml", model);
        }

        [HttpPost]
        [Mvc.ErrorSitecoreTranslation]
        public ActionResult LoginIndex(StreamEnergy.MyStream.Models.Authentication.LoginResponse response)
        {
            // Validate form data
            if (ModelState.IsValid)
            {
                // Go to the /account page
                var ReturnURL = new RedirectResult("~/account");
                return ReturnURL;
            }
            else
            {
                // Return validation errors
                return View("~/Views/Components/Authentication/My Stream Account.cshtml", response);
            }
        }
    }
}