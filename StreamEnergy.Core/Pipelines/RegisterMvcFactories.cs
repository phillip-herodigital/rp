using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;
using StreamEnergy.Mvc.Sitecore;

namespace StreamEnergy.Pipelines
{
    public class RegisterMvcFactories
    {
        [UsedImplicitly]
        public virtual void Process(PipelineArgs args)
        {
            SetupMvcInversionOfControl();
            SetupMvcValidations();
        }

        private static void SetupMvcInversionOfControl()
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;

            ControllerBuilder.Current.SetControllerFactory(new Mvc.ControllerFactory(ControllerBuilder.Current.GetControllerFactory(), container));
            DependencyResolver.SetResolver(new global::Unity.Mvc5.UnityDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new global::Unity.WebApi.UnityDependencyResolver(container);

            GlobalConfiguration.Configuration.Formatters.Insert(0, new Mvc.JsonNetFormatter());

            var providers = ModelValidatorProviders.Providers.ToArray();
            ModelValidatorProviders.Providers.Clear();
            ModelValidatorProviders.Providers.Add(new SitecoreTranslatingModelValidatorProvider(providers));

            GlobalFilters.Filters.Add(new Mvc.AntiForgeryFilterMvcAttribute() { CheckXsrfHeader = false });
            GlobalConfiguration.Configuration.Filters.Add(new Mvc.AntiForgeryFilterWebApiAttribute());
        }

        private void SetupMvcValidations()
        {
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(RequireValueAttribute), typeof(RequireValueAttributeAdapter));
        }
    }
}
