using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace StreamEnergy.Services.Clients
{
    public class ServiceMockResolver
    {
        public ServiceMockResolver()
        {
            MockResolvers = new List<IServiceMockResolver>();
        }

        public List<StreamEnergy.Services.Clients.IServiceMockResolver> MockResolvers { get; private set; }

        public bool ApplyMock(IInvocation invocation)
        {
            foreach (var entry in MockResolvers)
            {
                if (entry.ApplyMock(invocation))
                    return true;
            }
            return false;
        }
    }
}
