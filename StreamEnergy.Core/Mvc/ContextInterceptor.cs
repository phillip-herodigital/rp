using Castle.DynamicProxy;
using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Web;

namespace StreamEnergy.Mvc
{
    class ContextInterceptor : IInterceptor
    {
        private readonly static System.Reflection.MethodInfo getSession;
        private readonly static System.Reflection.MethodInfo getContents;
        private readonly static System.Reflection.MethodInfo[] setSessionItems;
        private readonly static System.Reflection.MethodInfo getResponse;
        private readonly static System.Reflection.MethodInfo getOutput;
        private HttpSessionStateBase sessionProxy;
        private HttpResponseBase responseProxy;
        private readonly TextWriter outputWriter;

        static ContextInterceptor()
        {
            getSession = ((Expression<Func<HttpContextBase, HttpSessionStateBase>>)((b) => b.Session)).SimpleProperty().GetMethod;
            getResponse = ((Expression<Func<HttpContextBase, HttpResponseBase>>)((b) => b.Response)).SimpleProperty().GetMethod;

            getContents = ((Expression<Func<HttpSessionStateBase, HttpSessionStateBase>>)((b) => b.Contents)).SimpleProperty().GetMethod;

            setSessionItems = (from p in typeof(HttpSessionStateBase).GetProperties()
                               where p.Name == "Item"
                               select p.SetMethod)
                               .Concat(new[] { ((Expression<Action<HttpSessionStateBase>>)((b) => b.Add("test", 0))).SimpleMethodCall() }).ToArray();

            getOutput = ((Expression<Func<HttpResponseBase, TextWriter>>)((b) => b.Output)).SimpleProperty().GetMethod;

        }

        public ContextInterceptor(TextWriter outputWriter = null)
        {
            this.outputWriter = outputWriter;
        }

        void IInterceptor.Intercept(IInvocation invocation)
        {
            if (invocation.Method == getSession)
            {
                var innerValue = ((HttpContextBase)invocation.InvocationTarget).Session;
                if (innerValue != null && sessionProxy == null)
                    sessionProxy = MvcProxyGenerator.Generator.CreateClassProxyWithTarget(((HttpContextBase)invocation.InvocationTarget).Session, this);
                invocation.ReturnValue = sessionProxy;
                return;
            }
            else if (invocation.Method == getContents)
            {
                invocation.ReturnValue = sessionProxy;
                return;
            }
            else if (setSessionItems.Contains(invocation.Method))
            {
                var temp = new System.Runtime.Serialization.Formatters.Binary.BinaryFormatter();
                using (var ms = new MemoryStream())
                {
                    try
                    {
                        temp.Serialize(ms, invocation.Arguments[1]);
                    }
                    catch (Exception ex)
                    {
                        throw new InvalidOperationException("All objects placed into session must be serializable.", ex);
                    }
                }
            }
            else if (invocation.Method == getResponse)
            {
                if (responseProxy == null)
                    responseProxy = MvcProxyGenerator.Generator.CreateClassProxyWithTarget(((HttpContextBase)invocation.InvocationTarget).Response, this);
                invocation.ReturnValue = responseProxy;
                return;
            }
            else if (outputWriter != null && invocation.Method == getOutput)
            {
                invocation.ReturnValue = outputWriter;
                return;
            }
            invocation.Proceed();
        }
    }
}
