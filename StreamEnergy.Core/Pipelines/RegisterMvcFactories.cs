using Sitecore;
using Sitecore.Pipelines;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Web.Mvc;

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
        }

        private void SetupMvcValidations()
        {

            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(RequireValueAttribute), typeof(RequireValueAttributeAdapter));
            //modelValidatorProvider
        }
    }
}
