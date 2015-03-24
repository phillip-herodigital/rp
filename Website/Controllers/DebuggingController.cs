using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using ResponsivePath.Logging;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Mvc;

namespace StreamEnergy.MyStream.Controllers
{
    public class DebuggingController : Controller
    {
        private ILogReader reader;

        public DebuggingController(EnvironmentCategory environment, ILogReader reader)
        {
            if (environment == EnvironmentCategory.Production)
            {
                throw new NotSupportedException();
            }
            this.reader = reader;
        }

        public ActionResult LogViewer()
        {
            if (Request.Params["sessionAbandon"] == "true")
            {
                Session.Abandon();
                Response.Cookies.Add(new HttpCookie("ASP.NET_SessionId", ""));
                return Redirect("/debugging/log-viewer");
            }
            var indexes = new NameValueCollection()
            {
                { "SessionID", Request.Params["sessionID"] ?? Session.SessionID }
            };
            if (Request.QueryString.Count > 0)
                indexes = Request.QueryString;
            return View("~/Views/Pages/Debugging/LogViewer.cshtml", indexes);
        }

    }
}