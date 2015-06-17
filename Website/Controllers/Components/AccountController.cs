﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class AccountController : Controller
    {
        private ApiControllers.AccountController inner;
        private readonly ISettings settings;

        public AccountController(ApiControllers.AccountController inner, ISettings settings)
        {
            this.inner = inner;
            this.settings = settings;
        }

        public ActionResult AccountBalancesIndex()
        {
            return View("~/Views/Components/Account/Overview/Account Balances and Payments.cshtml");
        }

        public ActionResult MyEnergyUsageIndex()
        {
            return View("~/Views/Components/Account/Overview/My Energy Usage.cshtml");
        }

        public ActionResult UtilityProvidersIndex()
        {
            return View("~/Views/Components/Account/Overview/Utility Providers.cshtml");
        }

        public ActionResult MyInvoicesIndex()
        {
            return View("~/Views/Components/Account/Overview/My Invoices.cshtml");
        }

        public ActionResult MyPaymentsIndex()
        {
            return View("~/Views/Components/Account/Overview/My Payments.cshtml");
        }

        public ActionResult MakeAPaymentIndex()
        {
            return View("~/Views/Components/Account/Overview/Make a Payment.cshtml");
        }

        public ActionResult OneTimePaymentIndex()
        {
            if (!string.IsNullOrEmpty(settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode")) && Request.QueryString["State"] == "GA")
            {
                return Redirect("/ga-upgrade-faq");
            }
            return View("~/Views/Components/Payments/One Time Payment.cshtml");
        }

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