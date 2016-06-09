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
using StreamEnergy.Mvc;
using System.Web.Http.Dispatcher;
using Sitecore.Services.Core;
using System.Web.Http.Dependencies;

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

        class WebApiResolver : System.Web.Http.Dependencies.IDependencyResolver, IDependencyScope, IDisposable
        {
            global::Unity.WebApi.UnityDependencyResolver unityDependencyResolver;
            Microsoft.Practices.Unity.IUnityContainer container;
            readonly System.Web.Http.Dependencies.IDependencyResolver sitecoreResolver;
            public WebApiResolver(Microsoft.Practices.Unity.IUnityContainer container, System.Web.Http.Dependencies.IDependencyResolver sitecoreResolver)
            {
                unityDependencyResolver = new global::Unity.WebApi.UnityDependencyResolver(container);
                this.container = container;
                this.sitecoreResolver = sitecoreResolver;
            }

            public System.Web.Http.Dependencies.IDependencyScope BeginScope()
            {
                return new WebApiResolver(container.CreateChildContainer(), this.sitecoreResolver);
            }

            public object GetService(Type serviceType)
            {
                if (serviceType.Namespace.StartsWith("Sitecore."))
                {
                    return sitecoreResolver.GetService(serviceType);
                }
                return unityDependencyResolver.GetService(serviceType);
            }

            public IEnumerable<object> GetServices(Type serviceType)
            {
                if (serviceType.Namespace.StartsWith("Sitecore."))
                {
                    return sitecoreResolver.GetServices(serviceType);
                }
                return unityDependencyResolver.GetServices(serviceType);
            }

            public void Dispose()
            {
                ((IDisposable)unityDependencyResolver).Dispose();
            }
        }

        private static void SetupMvcInversionOfControl()
        {
            var container = StreamEnergy.Unity.Container.Instance.Unity;

            //ControllerBuilder.Current.SetControllerFactory(new Mvc.ControllerFactory(ControllerBuilder.Current.GetControllerFactory(), container));
            DependencyResolver.SetResolver(new global::Unity.Mvc5.UnityDependencyResolver(container));
            GlobalConfiguration.Configuration.DependencyResolver = new WebApiResolver(container, GlobalConfiguration.Configuration.DependencyResolver);

            GlobalConfiguration.Configuration.Formatters.Insert(0, new Mvc.JsonNetFormatter());

            var providers = ModelValidatorProviders.Providers.ToArray();
            ModelValidatorProviders.Providers.Clear();
            ModelValidatorProviders.Providers.Add(new SitecoreTranslatingModelValidatorProvider(providers));

            GlobalFilters.Filters.Add(new Mvc.AntiForgeryFilterMvcAttribute() { CheckXsrfHeader = false });
            GlobalConfiguration.Configuration.Filters.Add(new Mvc.AntiForgeryFilterWebApiAttribute());
            GlobalConfiguration.Configuration.Services.Add(typeof(System.Web.Http.ExceptionHandling.IExceptionLogger), new Mvc.WebApiExceptionLogging());
        }

        private void SetupMvcValidations()
        {
            DataAnnotationsModelValidatorProvider.RegisterAdapter(typeof(RequireValueAttribute), typeof(RequireValueAttributeAdapter));
        }
    }
}
