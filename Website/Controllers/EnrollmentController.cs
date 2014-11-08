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
            NameValueCollection enrollmentDpiParameters = null;
            if (HttpContext.Items.Contains("Enrollment Dpi Parameters"))
                enrollmentDpiParameters = (NameValueCollection)(HttpContext.Items["Enrollment Dpi Parameters"]);
            inner.Initialize(enrollmentDpiParameters: enrollmentDpiParameters).Wait();
            return this.Content(StreamEnergy.Json.Stringify(inner.ClientData()));
        }

        public ActionResult EnrollmentSupportedUtilityStates()
        {
            var item = Sitecore.Context.Database.GetItem("/sitecore/content/Data/Taxonomy/Enrollment Supported Utility States");
            var data = item.Children.Where(c => c.Name != "GA" || string.IsNullOrEmpty(settings.GetSettingsValue("Maintenance Mode", "Ista Maintenance Mode"))).Select(child => new { abbreviation = child.Name, display = child.Fields["Display"].Value, css = child.Fields["CssClass"].Value });

            return this.Content(StreamEnergy.Json.Stringify(data));
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