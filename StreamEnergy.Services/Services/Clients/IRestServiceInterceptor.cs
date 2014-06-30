using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    public interface IRestServiceInterceptor
    {
        System.Net.Http.HttpResponseMessage FindMockResponse(System.Net.Http.HttpRequestMessage request, System.Threading.CancellationToken cancellationToken);
    }
}
