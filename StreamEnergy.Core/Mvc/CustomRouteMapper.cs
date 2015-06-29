using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Routing;
using Sitecore.Configuration;
using Sitecore.Services.Infrastructure.Sitecore;
using Sitecore.Services.Infrastructure.Web.Http;

namespace StreamEnergy.Mvc
{
    public class CustomRouteMapper : IMapRoutes
    {
        public DefaultRouteMapper DefaultRouteMapper { get; set; }
 
        public CustomRouteMapper()
        {
            this.Initialise();
        }
 
        private void Initialise()
        {
            // This would let me change the setting name if I wished and still have a default
            String routeBase = Settings.GetSetting(
                "Sitecore.Services.RouteBase",
                Globals.ConfigurationSettings.Routes.BaseDefaultValue
            );
         
            // Note we are passing in the route mapper route base from the config file
            this.DefaultRouteMapper = new DefaultRouteMapper(routeBase);
             
            // Perform any other initialisation here...
        }
 
        public void MapRoutes(HttpConfiguration config)
        {
            DefaultRouteMapper.MapRoutes(config);
             
            GlobalConfiguration.Configuration.MapHttpAttributeRoutes();
        }
         
        public void MapRoutes(RouteCollection routes)
        {
            DefaultRouteMapper.MapRoutes(routes);
        }
    }
}
