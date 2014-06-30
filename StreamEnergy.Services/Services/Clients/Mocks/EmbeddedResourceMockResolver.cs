using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

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

        public System.Net.Http.HttpResponseMessage FindMockResponse(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            var requestString = request.Method + " " + request.RequestUri.AbsolutePath +
                "\r\nHost " + request.RequestUri.Host +
                "\r\n" + request.Headers.ToString() +
                "\r\n" + ((object)request.Content ?? "").ToString();

            if (restEnvelopes.ContainsKey(requestString))
            {
                var responseString = restEnvelopes[requestString];

                var result = new System.Net.Http.HttpResponseMessage();

                var lines = responseString.Split(new[] { "\r\n" }, StringSplitOptions.None).TakeWhile(line => !string.IsNullOrEmpty(line)).ToArray();

                var match = Regex.Match(lines[0], "^(?<protocol>[^/]+)/(?<version>[0-9.]+) (?<status>[0-9]{3})(?: (?<message>.*))?");
                result.Version = Version.Parse(match.Groups["version"].Value);
                result.StatusCode = (System.Net.HttpStatusCode)int.Parse(match.Groups["status"].Value);
                result.ReasonPhrase = match.Groups["message"].Value;

                var remainder = responseString.Substring(string.Join("\r\n", lines).Length + 4);

                MemoryStream stream = new MemoryStream();
                StreamWriter writer = new StreamWriter(stream);
                writer.Write(remainder);
                writer.Flush();
                stream.Position = 0;

                result.Content = new System.Net.Http.StreamContent(stream);

                
                foreach (var header in from line in lines.Skip(1)
                                       let header = Regex.Match(line, "^(?<header>[^:]+): (?<value>.*)$")
                                       group header.Groups["value"].Value by header.Groups["header"].Value)
                {
                    if (header.Key.StartsWith("Content"))
                        result.Content.Headers.Add(header.Key, header);
                    else
                        result.Headers.Add(header.Key, header);
                }

                return result;
            }

            return null;
        }
    }
}
