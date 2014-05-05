using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace StreamEnergy.Mvc
{
    internal static class MvcProxyGenerator
    {
        private static readonly ProxyGenerator proxyGenerator = new ProxyGenerator();

        public static ProxyGenerator Generator
        {
            get { return proxyGenerator; }
        }

        internal static System.Web.HttpContextBase CreateHttpContextProxy(this System.Web.HttpContextBase httpContextBase, TextWriter outputWriter = null)
        {
            return Generator.CreateClassProxyWithTarget(httpContextBase, new ContextInterceptor(outputWriter));
        }
    }
}
