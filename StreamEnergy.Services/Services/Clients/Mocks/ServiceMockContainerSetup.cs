﻿using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using StreamEnergy.Services.Clients.Interceptors;

namespace StreamEnergy.Services.Clients.Mocks
{
    class ServiceMockContainerSetup : Unity.IContainerSetupStrategy
    {
        public void SetupUnity(IUnityContainer unityContainer)
        {
            var mockResolver = unityContainer.Resolve<ServiceInterceptorResolver>();

            var embeddedResourceMocks = new EmbeddedResourceMockResolver(this.GetType().Assembly);
            mockResolver.MockResolvers.Add(embeddedResourceMocks);
            mockResolver.RestMockResolvers.Add(embeddedResourceMocks);

            var temp = unityContainer.Resolve<LambdaToResourceMockResolver>(new DependencyOverride(typeof(System.Reflection.Assembly), this.GetType().Assembly));

            //temp.Register<Sample.Temperature.TempConvertSoap>(s => s.CelsiusToFahrenheit(null), mockParams => mockParams.Contains("nice"), "StreamEnergy.Services.Clients.Mocks.CelsiusToFahrenheit_Response.soap");
            //temp.Register<Sample.Commons.SampleStreamCommonsSoap>(s => s.GetInvoices(null), mockParams => mockParams.Contains("new"), "StreamEnergy.Services.Clients.Mocks.GetInvoices_New_Response.soap");
            //temp.Register<Sample.Commons.SampleStreamCommonsSoap>(s => s.GetInvoices(null), mockParams => true, "StreamEnergy.Services.Clients.Mocks.GetInvoices_Response.soap");

            mockResolver.MockResolvers.Add(temp);
        }
    }
}
