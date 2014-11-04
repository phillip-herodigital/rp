using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients
{
    class AzureAcsTokenHandler : DelegatingHandler
    {
        private AzureAccessControlServiceTokenManager tokenManager;

        public AzureAcsTokenHandler(AzureAccessControlServiceTokenManager tokenManager, HttpMessageHandler innerHandler)
            : base(innerHandler)
        {
            this.tokenManager = tokenManager;
        }

        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            request.Headers.Authorization = await tokenManager.GetAuthorization();

#if DEBUG
            var stopwatch = new Stopwatch();
            stopwatch.Start();
#endif
            var result = await base.SendAsync(request, cancellationToken);
#if DEBUG
            stopwatch.Stop();
            Trace.WriteLine(request.RequestUri + " - " + stopwatch.ElapsedMilliseconds + "ms");
#endif

            return result;
        }
    }
}
