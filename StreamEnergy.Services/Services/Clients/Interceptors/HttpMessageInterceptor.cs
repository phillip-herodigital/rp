using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;

namespace StreamEnergy.Services.Clients.Interceptors
{
    class HttpMessageInterceptor : DelegatingHandler
    {
        private ServiceInterceptorResolver serviceInterceptorResolver;

        public HttpMessageInterceptor(ServiceInterceptorResolver serviceInterceptorResolver, HttpMessageHandler innerHandler)
            : base(innerHandler)
        {
            this.serviceInterceptorResolver = serviceInterceptorResolver;
        }

        protected override async System.Threading.Tasks.Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            var response = await serviceInterceptorResolver.FindMockResponse(request, cancellationToken);
            
            if (response != null)
                return response;
         
            response = await base.SendAsync(request, cancellationToken);

            response = await serviceInterceptorResolver.HandleResponse(request, response, cancellationToken);

            return response;
        }
    }
}
