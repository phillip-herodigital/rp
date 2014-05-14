using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class TempController : Controller
    {
        public ActionResult Index(string param)
        {
            if (param == null)
                return View();
            return View(new DomainModels.Enrollments.UserContext
                {
                    ContactInfo = new DomainModels.CustomerContact
                    {
                        Email = new DomainModels.Email { Address = "test" }
                    }
                });
        }

        [HttpPost]
        public ActionResult Index(DomainModels.Enrollments.UserContext form)
        {
            return View(form);
        }
	}
}