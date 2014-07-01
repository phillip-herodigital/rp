using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace StreamEnergy.Services.Clients.Interceptors
{
    public interface IRestServiceInterceptor
    {
        Task<System.Net.Http.HttpResponseMessage> FindMockResponse(System.Net.Http.HttpRequestMessage request);
        Task<System.Net.Http.HttpResponseMessage> HandleResponse(System.Net.Http.HttpRequestMessage request, System.Net.Http.HttpResponseMessage response);
    }
}
