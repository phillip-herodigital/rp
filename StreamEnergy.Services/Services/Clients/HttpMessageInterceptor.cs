using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    class HttpMessageInterceptor : HttpClientHandler
    {
        private ServiceInterceptorResolver serviceInterceptorResolver;

        public HttpMessageInterceptor(ServiceInterceptorResolver serviceInterceptorResolver)
        {
            this.serviceInterceptorResolver = serviceInterceptorResolver;
        }

        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            var response = await serviceInterceptorResolver.FindMockResponse(request, cancellationToken);
            
            if (response != null)
                return response;
         
            return await base.SendAsync(request, cancellationToken);
        }
    }
}
