using System;
namespace StreamEnergy.Services.Clients.Interceptors
{
    public interface IServiceInterceptor
    {
        bool ApplyMock(Castle.DynamicProxy.IInvocation invocation);
    }
}
