using StreamEnergy.Extensions;
using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    public class LambdaToResourceMockResolver : IServiceMockResolver
    {
        private struct ResponseTest
        {
            public Predicate<NameValueCollection> Test;
            public string Response;
        }

        private System.Reflection.Assembly sourceAsm;
        private readonly Dictionary<MethodInfo, List<ResponseTest>> envelopes = new Dictionary<MethodInfo, List<ResponseTest>>();

        public LambdaToResourceMockResolver(System.Reflection.Assembly sourceAsm)
        {
            this.sourceAsm = sourceAsm;
        }

        public void Register<T>(Expression<Func<T, object>> service, Predicate<NameValueCollection> match, string resource)
        {
            var method = service.SimpleMethodCall();

            if (!envelopes.ContainsKey(method))
            {
                envelopes.Add(method, new List<ResponseTest>());
            }

            using (var stream = sourceAsm.GetManifestResourceStream(resource))
            using (var sr = new StreamReader(stream))
            {
                envelopes[method].Add(new ResponseTest
                {
                    Test = match,
                    Response = sr.ReadToEnd()
                });
            }
        }

        bool IServiceMockResolver.ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            if (envelopes.ContainsKey(invocation.Method))
            {
                var mockParameters = new NameValueCollection(); // TODO - get these from somewhere
                var result = envelopes[invocation.Method].FirstOrDefault(m => m.Test(mockParameters));
                if (result.Response != null)
                {
                    invocation.ReturnValue = SoapConverter.FromSoap(result.Response, invocation.Method.ReturnType);
                    return true;
                }
            }
            return false;
        }
    }
}
