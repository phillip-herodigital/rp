using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Routing;

namespace StreamEnergy.Mvc
{
    class ExecuteInterceptor : IInterceptor
    {
        [DebuggerNonUserCode]
        void IInterceptor.Intercept(IInvocation invocation)
        {
            var arg = ((RequestContext)invocation.Arguments[0]);
            // Intentionally not using the dependency injected HttpContextBase because it won't be the intercepted one from Sitecore.
            var httpContextBase = arg.HttpContext.CreateHttpContextProxy();
            invocation.Arguments[0] = new System.Web.Routing.RequestContext(httpContextBase, arg.RouteData);

            invocation.Proceed();
        }
    }
}
