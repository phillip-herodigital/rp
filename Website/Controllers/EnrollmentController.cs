using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class EnrollmentController : Controller
    {
        private ApiControllers.EnrollmentController inner;

        public EnrollmentController(ApiControllers.EnrollmentController inner)
        {
            this.inner = inner;
        }

        public ActionResult ClientData()
        {
            return this.Content(StreamEnergy.Json.Stringify(inner.ClientData(null)));
        }

        public ActionResult EnrollmentNav()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Pages/Enrollment/Enrollment Page");
            return this.Content(StreamEnergy.Json.Stringify(new
            {
                utilityFlowService = item["Utility Service 1"],
                utilityFlowPlans = item["Utility Service 2"],
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
            return View("~/Views/Pages/Enrollment/Plan Selection.cshtml");
        }

        public ActionResult AccountInformation()
        {
            return View("~/Views/Pages/Enrollment/Account Information.cshtml");
        }

        public ActionResult CompleteOrder()
        {
            return View("~/Views/Pages/Enrollment/Complete Order.cshtml");
        }

        public ActionResult ServiceInformation()
        {
            return View("~/Views/Pages/Enrollment/Service Information.cshtml");
        }

        public ActionResult VerifyIdentity()
        {
            return View("~/Views/Pages/Enrollment/Verify Identity.cshtml");
        }
    }
}