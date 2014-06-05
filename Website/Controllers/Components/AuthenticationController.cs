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
    }
}