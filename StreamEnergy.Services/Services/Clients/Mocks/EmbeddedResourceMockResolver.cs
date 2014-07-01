using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients.Mocks
{
    class EmbeddedResourceMockResolver : IServiceInterceptor, IRestServiceInterceptor
    {
        private const string SoapRequestSuffix = "_Request.soap";
        private const string SoapResponseSuffix = "_Response.soap";
        private const string RestRequestSuffix = "_Request.rest";
        private const string RestResponseSuffix = "_Response.rest";
        private readonly Dictionary<string, string> soapEnvelopes;
        private readonly Dictionary<string, string> restEnvelopes;

        public EmbeddedResourceMockResolver(System.Reflection.Assembly sourceAsm)
        {
            var resourceNames = sourceAsm.GetManifestResourceNames();
            soapEnvelopes = (from requestEntry in resourceNames
                             let responseEntry = requestEntry.Replace(SoapRequestSuffix, SoapResponseSuffix)
                             where requestEntry.EndsWith(SoapRequestSuffix) && resourceNames.Contains(responseEntry)
                             select new
                             {
                                 Request = ReadResource(sourceAsm, requestEntry),
                                 Response = ReadResource(sourceAsm, responseEntry),
                             }).ToDictionary(e => e.Request, e => e.Response);
            restEnvelopes = (from requestEntry in resourceNames
                             let responseEntry = requestEntry.Replace(RestRequestSuffix, RestResponseSuffix)
                             where requestEntry.EndsWith(RestRequestSuffix) && resourceNames.Contains(responseEntry)
                             select new
                             {
                                 Request = ReadResource(sourceAsm, requestEntry),
                                 Response = ReadResource(sourceAsm, responseEntry),
                             }).ToDictionary(e => e.Request, e => e.Response);
        }

        private static string ReadResource(System.Reflection.Assembly sourceAsm, string name)
        {
            string request;
            using (var stream = sourceAsm.GetManifestResourceStream(name))
            using (var sr = new StreamReader(stream))
            {
                request = sr.ReadToEnd();
            }
            return request;
        }

        public bool ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            var request = SoapConverter.ToSoap(invocation.Arguments[0]);
            if (soapEnvelopes.ContainsKey(request))
            {
                invocation.ReturnValue = SoapConverter.FromSoap(soapEnvelopes[request], invocation.Method.ReturnType);
                return true;
            }
            return false;
        }

        public async Task<System.Net.Http.HttpResponseMessage> FindMockResponse(System.Net.Http.HttpRequestMessage request)
        {
            await Task.Yield();
            var requestString = HttpConverter.ToString(request);

            if (restEnvelopes.ContainsKey(requestString))
            {
                var responseString = restEnvelopes[requestString];

                return HttpConverter.ParseResponse(responseString);
            }

            return null;
        }

        public async Task<System.Net.Http.HttpResponseMessage> HandleResponse(System.Net.Http.HttpRequestMessage request, System.Net.Http.HttpResponseMessage response)
        {
            await Task.Yield();
            return response;
        }
    }
}
