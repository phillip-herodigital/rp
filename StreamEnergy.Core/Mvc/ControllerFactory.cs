﻿using Castle.DynamicProxy;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;
using System.Web.Routing;

namespace StreamEnergy.Mvc
{
    class ControllerFactory : global::Sitecore.Mvc.Controllers.SitecoreControllerFactory
    {
        private Microsoft.Practices.Unity.IUnityContainer container;

        public ControllerFactory(IControllerFactory originalControllerFactory, IUnityContainer container)
            : base(originalControllerFactory)
        {
            this.container = container;
        }

        public override IController CreateController(System.Web.Routing.RequestContext requestContext, string controllerName)
        {
            var result = base.CreateController(requestContext, controllerName);
            if (result is Controller && result is IDisposable)
            {
                return (Controller)MvcProxyGenerator.Generator.CreateClassProxyWithTarget(typeof(Controller), new[] { typeof(IDisposable) }, result, container.Resolve<ExecuteInterceptor>());
            }
            else if (result is Controller)
            {
                return (Controller)MvcProxyGenerator.Generator.CreateClassProxyWithTarget(result, container.Resolve<ExecuteInterceptor>());
            }
            return result;
        }

        protected override IController CreateControllerInstance(RequestContext requestContext, string controllerName)
        {
            if (controllerName.Contains("StreamEnergy.MyStream.Controllers.Components.AuthenticationController"))
            {
                controllerName = controllerName.Replace("StreamEnergy.MyStream.Controllers.Components.AuthenticationController", "StreamEnergy.MyStream.Controllers.Components.StreamAuthenticationController");
            }
            if ((global::Sitecore.Mvc.Helpers.TypeHelper.LooksLikeTypeName(controllerName)))
            {
                return (IController)container.Resolve(Type.GetType(controllerName));
            }
            return base.CreateControllerInstance(requestContext, controllerName);
        }


    }
}
