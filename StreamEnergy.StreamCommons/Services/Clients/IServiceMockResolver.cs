using System;
namespace StreamEnergy.Services.Clients
{
    public interface IServiceMockResolver
    {
        bool ApplyMock(Castle.DynamicProxy.IInvocation invocation);
    }
}
