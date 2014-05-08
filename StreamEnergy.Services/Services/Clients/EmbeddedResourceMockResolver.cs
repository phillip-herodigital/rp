using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients
{
    class EmbeddedResourceMockResolver : IServiceMockResolver
    {
        private const string RequestSuffix = "_Request.soap";
        private const string ResponseSuffix = "_Response.soap";
        private readonly Dictionary<string, string> envelopes;

        public EmbeddedResourceMockResolver(System.Reflection.Assembly sourceAsm)
        {
            envelopes = new Dictionary<string, string>();
            var resources = sourceAsm.GetManifestResourceNames();
            foreach (var requestEntry in resources.Where(e => e.EndsWith(RequestSuffix) && resources.Contains(e.Replace(RequestSuffix, ResponseSuffix))))
            {
                string request;
                using (var stream = sourceAsm.GetManifestResourceStream(requestEntry))
                using (var sr = new StreamReader(stream))
                {
                    request = sr.ReadToEnd();
                }

                using (var stream = sourceAsm.GetManifestResourceStream(requestEntry.Replace(RequestSuffix, ResponseSuffix)))
                using (var sr = new StreamReader(stream))
                {
                    envelopes.Add(request, sr.ReadToEnd());
                }

            }
        }

        public bool ApplyMock(Castle.DynamicProxy.IInvocation invocation)
        {
            var request = SoapConverter.ToSoap(invocation.Arguments[0]);
            if (envelopes.ContainsKey(request))
            {
                invocation.ReturnValue = SoapConverter.FromSoap(envelopes[request], invocation.Method.ReturnType);
                return true;
            }
            return false;
        }
    }
}
