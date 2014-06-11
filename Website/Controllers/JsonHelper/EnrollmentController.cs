using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.JsonHelper
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
            return this.Content(StreamEnergy.Json.Stringify(inner.ClientData()));
        }
    }
}