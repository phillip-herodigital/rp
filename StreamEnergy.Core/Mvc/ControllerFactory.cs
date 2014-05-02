using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Routing;

namespace StreamEnergy.Mvc
{
    class ControllerFactory : IControllerFactory
    {
        private IControllerFactory originalControllerFactory;
        private Microsoft.Practices.Unity.IUnityContainer container;

        public ControllerFactory(IControllerFactory originalControllerFactory, Microsoft.Practices.Unity.IUnityContainer container)
        {
            this.originalControllerFactory = originalControllerFactory;
            this.container = container;
        }

        public IController CreateController(System.Web.Routing.RequestContext requestContext, string controllerName)
        {
            var result = originalControllerFactory.CreateController(requestContext, controllerName);
            var controllerBase = result as ControllerBase;
            if (controllerBase != null)
            {
                return MvcProxyGenerator.Generator.CreateInterfaceProxyWithTarget(result, new ExecuteInterceptor());
            }
            return result;
        }

        public System.Web.SessionState.SessionStateBehavior GetControllerSessionBehavior(System.Web.Routing.RequestContext requestContext, string controllerName)
        {
            return originalControllerFactory.GetControllerSessionBehavior(requestContext, controllerName);
        }

        public void ReleaseController(IController controller)
        {
            originalControllerFactory.ReleaseController(controller);
        }

    }
}
