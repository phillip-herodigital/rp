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

                var configuration = GetConfiguration();
                SetupUnityContainer(configuration);
                SetupMvcInversionOfControl();

                SetupStreamEnergyBundles();
            }
        }

        private Configuration.ConfigurationSection GetConfiguration()
        {
            var configuration = WebConfigurationManager.OpenWebConfiguration("~").GetSection("streamEnergy") as Configuration.ConfigurationSection;

            if (configuration == null)
            {
                global::Sitecore.Diagnostics.Log.SingleError("Could not find \"streamEnergy\" configuration section.", this);
                throw new InvalidOperationException("Could not find \"streamEnergy\" configuration section.");
            }
            return configuration;
        }

        private static void SetupUnityContainer(Configuration.ConfigurationSection configuration)
        {
            StreamEnergy.Unity.Container.Instance.Initialize((from iocInitializer in configuration.InversionOfControlInitializers
                                                              let value = iocInitializer.Build()
                                                              where value != null
                                                              select value).ToArray());
        }

        private static void SetupMvcInversionOfControl()
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;

            ControllerBuilder.Current.SetControllerFactory(new Mvc.ControllerFactory(ControllerBuilder.Current.GetControllerFactory(), container));
            DependencyResolver.SetResolver(new global::Unity.Mvc5.UnityDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new global::Unity.WebApi.UnityDependencyResolver(container);
        }

        private void SetupStreamEnergyBundles()
        {
            BundleTable.Bundles.Add(new StyleBundle("~/bundles/Styles")
                .Include("~/frontend/assets/css/*.css"));

            BundleTable.Bundles.Add(new ScriptBundle("~/bundles/Scripts")
                .Include("~/frontend/assets/js/libs/modernizr/modernizr.js")
                .Include("~/frontend/assets/js/libs/angular/angular.min.js")
                .Include("~/frontend/assets/js/libs/angular-bootstrap/ui-bootstrap-tpls.min.js")
                .Include("~/frontend/assets/js/libs/angular-ui-utils/ui-utils.min.js")
                .Include("~/frontend/assets/js/app.js")
                .IncludeDirectory("~/frontend/assets/js/filters/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/directives/", "*.js", true)
                .IncludeDirectory("~/frontend/assets/js/controllers/", "*.js", true));
        }
    }
}
