using Castle.DynamicProxy;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceModel;
using System.ServiceModel.Channels;
using System.ServiceModel.Description;
using System.Text;
using System.Xml;

namespace StreamEnergy.Services.Clients
{
    public class ServiceMockInterceptor : IInterceptor
    {
        private readonly ServiceMockResolver serviceMockResolver;

        public ServiceMockInterceptor(ServiceMockResolver serviceMockResolver)
        {
            this.serviceMockResolver = serviceMockResolver;
        }

        [DebuggerNonUserCode]
        void IInterceptor.Intercept(IInvocation invocation)
        {
            if (!serviceMockResolver.ApplyMock(invocation))
                invocation.Proceed();
        }

    }
}
