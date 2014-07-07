using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients
{
    class AzureAcsTokenHandler : HttpMessageInterceptor
    {
        private AzureAccessControlServiceTokenManager tokenManager;

        public AzureAcsTokenHandler(AzureAccessControlServiceTokenManager tokenManager, ServiceInterceptorResolver serviceInterceptorResolver)
            : base(serviceInterceptorResolver)
        {
            this.tokenManager = tokenManager;
        }

        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            request.Headers.Authorization = await tokenManager.GetAuthorization();

            return await base.SendAsync(request, cancellationToken);
        }
    }
}
