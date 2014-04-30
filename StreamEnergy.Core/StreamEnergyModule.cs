using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Configuration;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;

namespace StreamEnergy
{
    class StreamEnergyModule : IHttpModule
    {
        static StreamEnergyModule instance = null;

        void IHttpModule.Dispose()
        {
            if (instance == this)
            {
                instance = null;
            }
        }

        void IHttpModule.Init(HttpApplication context)
        {
            if (instance == null)
            {
                instance = this;

                var configuration = WebConfigurationManager.OpenWebConfiguration("~").GetSection("streamEnergy") as Configuration.ConfigurationSection;

                if (configuration == null)
                {
                    Sitecore.Diagnostics.Log.SingleError("Could not find \"streamEnergy\" configuration section.", this);
                }
                else
                {
                    StreamEnergy.Unity.Container.Instance.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                                                                      let value = iocInitializer.Build()
                                                                      where value != null
                                                                      select value).ToArray());
                }

                var container = StreamEnergy.Unity.Container.Instance.Unity;

                ControllerBuilder.Current.SetControllerFactory(new Mvc.ControllerFactory(ControllerBuilder.Current.GetControllerFactory(), container));
                DependencyResolver.SetResolver(new global::Unity.Mvc5.UnityDependencyResolver(container));
                GlobalConfiguration.Configuration.DependencyResolver = new global::Unity.WebApi.UnityDependencyResolver(container);
            }
        }
    }
}
