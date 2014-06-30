using System;
namespace StreamEnergy.Services.Clients
{
    public interface IServiceInterceptor
    {
        bool ApplyMock(Castle.DynamicProxy.IInvocation invocation);
    }
}
