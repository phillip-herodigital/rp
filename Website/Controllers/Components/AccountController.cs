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

        public ActionResult AccountSelectorIndex()
        {
            return View("~/Views/Components/Account/Profile/Account Selector.cshtml");
        }

        public ActionResult AccountInformationIndex()
        {
            return View("~/Views/Components/Account/Profile/Account Information.cshtml");
        }

        public ActionResult NotificationSettingsIndex()
        {
            return View("~/Views/Components/Account/Profile/Notification Settings.cshtml");
        }

        public ActionResult AddNewAccountIndex()
        {
            return View("~/Views/Components/Account/Profile/Add New Account.cshtml");
        }

        public ActionResult EnrolledAccountsIndex()
        {
            return View("~/Views/Components/Account/Profile/Enrolled Accounts.cshtml");
        }
    }
}