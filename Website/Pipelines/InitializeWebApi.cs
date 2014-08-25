using Sitecore;
using Sitecore.Pipelines;
using StreamEnergy.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Web.Http.Routing;

namespace StreamEnergy.MyStream.Pipelines
{
    public class InitializeWebApi
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            var routes = System.Web.Routing.RouteTable.Routes;

            GlobalConfiguration.Configuration.MapHttpAttributeRoutes();

            routes.MapHttpRoute("DefaultApiWithAction", "Api/{controller}/{action}/{id}", new { id = RouteParameter.Optional })
                .RouteHandler = new SessionRouteHandler();
            routes.MapHttpRoute("DefaultApiGet", "Api/{controller}", new { action = "Get" }, new { httpMethod = new HttpMethodConstraint(HttpMethod.Get) })
                .RouteHandler = new SessionRouteHandler();
            routes.MapHttpRoute("DefaultApiPost", "Api/{controller}", new { action = "Post" }, new { httpMethod = new HttpMethodConstraint(HttpMethod.Post) })
                .RouteHandler = new SessionRouteHandler();
            routes.MapHttpRoute("DefaultApiPut", "Api/{controller}", new { action = "Put" }, new { httpMethod = new HttpMethodConstraint(HttpMethod.Put) })
                .RouteHandler = new SessionRouteHandler();
            routes.MapHttpRoute("DefaultApiDelete", "Api/{controller}", new { action = "Delete" }, new { httpMethod = new HttpMethodConstraint(HttpMethod.Delete) })
                .RouteHandler = new SessionRouteHandler();

            if (!global::Sitecore.Context.IsUnitTesting)
            {
                GlobalConfiguration.Configuration.EnsureInitialized();
            }
        }


    }
}