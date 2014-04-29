using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;

namespace Website
{
    public class Global : Sitecore.Web.Application
    {
        private static bool initialized;

        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }

        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("");
            routes.MapRoute(
                "Default",
                "HelloWorld/{action}/{id}",
                new { controller = "HelloWorld", action = "Index", id = UrlParameter.Optional }
            );
        }

        public override void Init()
        {
            if (!initialized)
            {
                initialized = true;
                AreaRegistration.RegisterAllAreas();

                RegisterGlobalFilters(GlobalFilters.Filters);
                RegisterRoutes(RouteTable.Routes);
            }
            base.Init();
        }
    }
}