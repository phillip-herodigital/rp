using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.MobileApp.controllers
{
    public class PagesController : Controller
    {
        public ActionResult LoginPage() {
            return View("~/MobileApp/Views/Pages/Login/signin.cshtml");
        }
        public ActionResult HomePage()
        {
            return View("~/MobileApp/Views/Pages/home.cshtml");
        }

        public ActionResult BasePage()
        {
            return View("~/MobileApp/Views/Pages/index.cshtml");
        }
    }
}