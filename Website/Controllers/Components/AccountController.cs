using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class AccountController : Controller
    {
        public ActionResult OnlineAccountIndex()
        {
            return View("~/Views/Components/Account/Profile/My Online Account Information.cshtml");
        }
    }
}