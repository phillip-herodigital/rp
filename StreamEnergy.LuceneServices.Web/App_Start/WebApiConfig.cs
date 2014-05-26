using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace StreamEnergy.LuceneServices.Web.App_Start
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            GlobalConfiguration.Configuration.Formatters.Insert(0, new Mvc.JsonNetFormatter());

            // Web API configuration and services

            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );


            config.Routes.MapHttpRoute(
                name: "LookupApi",
                routeTemplate: "api/address/lookup/{state}/{query}",
                defaults: new { controller ="address", action="lookup" }
            );
        }
    }
}
