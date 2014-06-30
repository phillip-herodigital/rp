using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    public class ServiceInterceptorResolver
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

        public System.Threading.Tasks.Task<System.Net.Http.HttpResponseMessage> FindMockResponse(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken)
        {
            return System.Threading.Tasks.Task.Run<System.Net.Http.HttpResponseMessage>(() =>
            {
                foreach (var entry in RestMockResolvers)
                {
                    var response = entry.FindMockResponse(request, cancellationToken);
                    if (response != null)
                        return response;
                    if (cancellationToken.IsCancellationRequested)
                        return null;
                }

                return null;
            });
        }

    }
}
