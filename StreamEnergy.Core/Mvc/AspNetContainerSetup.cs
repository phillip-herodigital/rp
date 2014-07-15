using Microsoft.Practices.Unity;
using StreamEnergy.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Security;

namespace StreamEnergy.Mvc
{
    class AspNetContainerSetup : IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            unityContainer.RegisterType<HttpContextBase>(new PerHttpContextLifetimeManager(() => new HttpContextWrapper(HttpContext.Current)), new InjectionFactory(CreateInterceptedHttpContext));
            unityContainer.RegisterType<HttpSessionStateBase>(new InjectionFactory(uc => uc.Resolve<HttpContextBase>().Session));
            unityContainer.RegisterType<HttpRequestBase>(new InjectionFactory(uc => uc.Resolve<HttpContextBase>().Request));
            unityContainer.RegisterInstance<IServerUtility>(new ServerUtility());
            unityContainer.RegisterInstance<MembershipProvider>(Membership.Provider);
        }

        private HttpContextBase CreateInterceptedHttpContext(IUnityContainer container)
        {
            return MvcProxyGenerator.CreateHttpContextProxy(new HttpContextWrapper(HttpContext.Current));
        }
    }
}
