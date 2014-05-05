using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web.Routing;

namespace StreamEnergy.Mvc
{
    class ExecuteInterceptor : IInterceptor
    {
        private bool first = true;

        public ExecuteInterceptor()
        {
        }

        void IInterceptor.Intercept(IInvocation invocation)
        {
            var arg = ((RequestContext)invocation.Arguments[0]);
            var httpContextBase = arg.HttpContext.CreateHttpContextProxy();
            invocation.Arguments[0] = new System.Web.Routing.RequestContext(httpContextBase, arg.RouteData);

            invocation.Proceed();
        }
    }
}
