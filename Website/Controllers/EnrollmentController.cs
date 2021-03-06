﻿using StreamEnergy.Services.Helpers;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class EnrollmentController : Controller
    {
        private ApiControllers.EnrollmentController inner;
        private readonly ISettings settings;

        public EnrollmentController(ApiControllers.EnrollmentController inner, ISettings settings)
        {
            this.inner = inner;
            this.settings = settings;
        }

        protected override void Dispose(bool disposing)
        {
            inner.Dispose();
            base.Dispose(disposing);
        }

        public ActionResult ClientData()
        {
            inner.Initialize().Wait();
            return this.Content(StreamEnergy.Json.Stringify(inner.ClientData()));
        }

        public ActionResult ResetEnrollment()
        {
            inner.Reset();
            return new EmptyResult();
        }

        public ActionResult EnrollmentSupportedUtilityStates()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Enrollment Supported Utility States");
            var data = item.Children.Where(c => c.Name != "GA" || string.IsNullOrEmpty(settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode"))).Select(child => new { abbreviation = child.Name, display = child.Fields["Display"].Value, css = child.Fields["CssClass"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult EnrollmentSupportedEnrollmentTypes()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Enrollment Types");
            var data = item.Children.Select(child => new { enrollmenttype = child.Name, display = child.Fields["Enrollment Type"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
        }

        public ActionResult EnrollmentDefaultState()
        {
            bool useRemoteEnrollment;
            NameValueCollection queryString;
            EnrollmentTrafficCopHelper.HandlePersistence(out useRemoteEnrollment, out queryString);
            return this.Content((queryString["St"] ?? queryString["State"] ?? "").ToUpper() == "GA" ? "GA" : "TX");
        }

        public ActionResult EnrollmentNav()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Pages/Enrollment/Enrollment Page");
            return this.Content(StreamEnergy.Json.Stringify(new
            {
                utilityFlowService = item["Utility Service 1"],
                utilityFlowPlans = item["Utility Service 2"],
                utilityFlowPlansCommercial = item["Utility Service 2 Commercial"],
                homelifeFlow = "",
                phoneFlow = "",
                accountInformation = item["Account Information"],
                verifyIdentity = item["Verify Identity"],
                reviewOrder = item["Review Order"],
                orderConfirmed = item["Order Confirmation"],
            }));
        }

        public ActionResult PlanSelection()
        {
            return View("~/Views/Components/Enrollment/Utility/Plan Selection.cshtml");
        }

        public ActionResult AccountInformation()
        {
            return View("~/Views/Components/Enrollment/Account Information.cshtml");
        }

        public ActionResult CompleteOrder()
        {
            return View("~/Views/Components/Enrollment/Complete Order.cshtml");
        }

        public ActionResult ServiceInformation()
        {
            return View("~/Views/Components/Enrollment/Utility/Service Information.cshtml");
        }

        public ActionResult VerifyIdentity()
        {
            return View("~/Views/Components/Enrollment/Verify Identity.cshtml");
        }

        public ActionResult SinglePageEnrollment()
        {
            return View("~/Views/Pages/Enrollment/Single Page Enrollment.cshtml");
        }

        public ActionResult ProtectiveServices()
        {
            return View("~/Views/Components/Enrollment/Protective/Protective Services.cshtml");
        }
    }
}