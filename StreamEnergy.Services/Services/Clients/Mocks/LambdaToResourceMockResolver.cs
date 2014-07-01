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
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients.Mocks
{
    public class LambdaToResourceMockResolver : IServiceInterceptor
    {
        private struct ResponseTest
        {
            public Predicate<string[]> Test;
            public string Response;
        }

        private readonly System.Reflection.Assembly sourceAsm;
        private readonly MockParameterBuilder mockParameterBuilder;
        private readonly Dictionary<MethodInfo, List<ResponseTest>> envelopes = new Dictionary<MethodInfo, List<ResponseTest>>();

        public LambdaToResourceMockResolver(System.Reflection.Assembly sourceAsm, MockParameterBuilder mockParameterBuilder)
        {
            this.sourceAsm = sourceAsm;
            this.mockParameterBuilder = mockParameterBuilder;
        }

        public void Register<T>(Expression<Func<T, object>> service, Predicate<string[]> match, string resource)
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

        bool IServiceInterceptor.ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            if (envelopes.ContainsKey(invocation.Method))
            {
                var mockParameters = mockParameterBuilder.Build();
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
