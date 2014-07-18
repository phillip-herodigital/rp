using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers.Components
{
    public class ComponentController : Controller
    {
        public ActionResult Index()
        {
            return View(Sitecore.Mvc.Presentation.RenderingContext.Current.Rendering.Parameters["path"]);
        }
    }
}