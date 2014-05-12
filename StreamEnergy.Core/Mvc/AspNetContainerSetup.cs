using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace StreamEnergy.Mvc
{
    class AspNetContainerSetup : IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<HttpContextBase>(new PerHttpContextLifetimeManager(() => new HttpContextWrapper(HttpContext.Current)), new InjectionFactory(CreateInterceptedHttpContext));
            unityContainer.RegisterType<HttpSessionStateBase>(new InjectionFactory(uc => uc.Resolve<HttpContextBase>().Session));
        }

        private HttpContextBase CreateInterceptedHttpContext(IUnityContainer container)
        {
            return MvcProxyGenerator.CreateHttpContextProxy(new HttpContextWrapper(HttpContext.Current));
        }
    }
}
