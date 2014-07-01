using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients.Interceptors
{
    public class ServiceInterceptorResolver : IServiceInterceptor
    {
        public ServiceInterceptorResolver()
        {
            MockResolvers = new List<IServiceInterceptor>();
            RestMockResolvers = new List<IRestServiceInterceptor>();
        }

        public List<IServiceInterceptor> MockResolvers { get; private set; }
        public List<IRestServiceInterceptor> RestMockResolvers { get; private set; }

        public bool ApplyMock(IInvocation invocation)
        {
            foreach (var entry in MockResolvers)
            {
                if (entry.ApplyMock(invocation))
                    return true;
            }
            return false;
        }

        public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> FindMockResponse(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            foreach (var entry in RestMockResolvers)
            {
                var response = await entry.FindMockResponse(request);
                if (response != null)
                    return response;
                if (cancellationToken.IsCancellationRequested)
                    return null;
            }

            return null;
        }

        public async System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> HandleResponse(System.Net.Http.HttpRequestMessage request, System.Net.Http.HttpResponseMessage response, System.Threading.CancellationToken cancellationToken)
        {
            foreach (var entry in RestMockResolvers)
            {
                response = await entry.HandleResponse(request, response) ?? response;
                if (cancellationToken.IsCancellationRequested)
                    return response;
            }

            return response;
        }
    }
}
